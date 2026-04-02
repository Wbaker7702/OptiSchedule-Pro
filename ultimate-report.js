import { PrismaClient } from '@prisma/client';

// Passing the config directly into the constructor 
// solves the "InitializationError" once and for all.
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});

async function main() {
  console.log("🚀 OptiSchedule Pro: Generating Enterprise Report...");
  try {
    // This fetches the first 5 entries. 
    // If the table 'schedule' doesn't exist, the error will tell us the real name!
    const data = await prisma.schedule.findMany({ take: 5 });
    console.table(data);
    console.log("✅ Report completed successfully.");
  } catch (e) {
    console.error("❌ Database Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
