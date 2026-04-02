import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./dev.db',
    },
  },
});

async function main() {
  console.log("🚀 OptiSchedule Pro: Enterprise Reporter Starting...");
  try {
    // This looks for a table named 'schedule'. 
    // If your table has a different name, the error will tell us!
    const data = await prisma.schedule.findMany({ take: 10 });
    console.table(data);
    console.log("✅ Report generated successfully.");
  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
