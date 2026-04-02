/**
 * OptiSchedule Pro - Enterprise Data Utility
 * System: UserLAnd (Ubuntu)
 * Description: Clean Data Ingestion and Reporting Tool
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DOWNLOAD_PATH = '/sdcard/Download'; // Standard Android UserLAnd path

/**
 * 1. DATA INGESTION (Enterprise Loader)
 * Reads a CSV from your Android Downloads and injects it into the DB.
 */
async function ingestData(tableName, fileName) {
    const filePath = path.join(DOWNLOAD_PATH, fileName);
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ Ingestion Source Not Found: ${filePath}`);
        return;
    }

    console.log(`🚀 Ingesting ${fileName} into ${tableName}...`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const [header, ...rows] = content.split('\n').filter(line => line.trim() !== '');

    const keys = header.split(',');
    
    for (const row of rows) {
        const values = row.split(',');
        const dataObj = {};
        keys.forEach((key, index) => {
            // Basic type casting: Convert numbers if possible
            const val = values[index].trim();
            dataObj[key.trim()] = isNaN(val) ? val : Number(val);
        });

        try {
            await prisma[tableName].create({ data: dataObj });
        } catch (err) {
            console.error(`⚠️ Row skipped: ${err.message}`);
        }
    }
    console.log(`✅ Ingestion Complete.`);
}

/**
 * 2. REPORT GENERATION (Clean Export)
 * Pulls data and saves a formatted CSV to Android storage.
 */
async function generateReport(tableName) {
    console.log(`📊 Generating Enterprise Report for: ${tableName}...`);
    
    try {
        const records = await prisma[tableName].findMany();
        
        if (records.length === 0) {
            console.log("⚠️ No data available for report.");
            return;
        }

        const headers = Object.keys(records[0]).join(',');
        const rows = records.map(r => Object.values(r).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const reportName = `OptiSchedule_${tableName}_${new Date().toISOString().split('T')[0]}.csv`;
        const outputPath = path.join(DOWNLOAD_PATH, reportName);

        fs.writeFileSync(outputPath, csvContent);
        console.log(`✅ Report Saved to: ${outputPath}`);
        
    } catch (err) {
        console.error(`❌ Reporting Error: ${err.message}`);
    }
}

/**
 * MAIN EXECUTION
 */
async function main() {
    // Replace 'task' with your actual Prisma model name
    const targetModel = 'task'; 

    // Uncomment the line below to ingest data from /sdcard/Download/test_data.csv
    // await ingestData(targetModel, 'test_data.csv');

    await generateReport(targetModel);
}

main()
    .catch(e => console.error("🛑 System Failure:", e))
    .finally(async () => await prisma.$disconnect());
