import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
          details: "Automated result from UserLAnd session" 
        }
      });
      data = await prisma.task.findMany();
    }

    // Generate CSV String
    const headers = "ID,Name,Status,Details,Timestamp\n";
    const csvContent = data.map(r => 
      `${r.id},"${r.name}","${r.status}","${r.details}","${r.createdAt}"`
    ).join("\n");

    // Output to Mobile Storage
    const path = "/sdcard/Download/OptiSchedule_Enterprise_Report.csv";
    fs.writeFileSync(path, headers + csvContent);
    
    console.log("✅ SUCCESS: Enterprise Report Generated!");
    console.log(`📂 Path: Android Downloads/OptiSchedule_Enterprise_Report.csv`);

  } catch (error) {
    console.error("🛑 Critical Failure:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();


