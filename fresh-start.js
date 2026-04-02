import { PrismaClient } from '@prisma/client';

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
    // Attempt to fetch data. If 'schedule' isn't the table name,
    // the error will list the correct ones!
    const data = await prisma.schedule.findMany({ take: 10 });
    console.table(data);
    console.log("✅ Report generated successfully.");
  } catch (e) {
    console.error("❌ Database Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
