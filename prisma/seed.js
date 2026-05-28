const { PrismaClient } = require("@prisma/client");
const { seedDemoStore } = require("./demoSeed");

const prisma = new PrismaClient();

async function main() {
  await seedDemoStore(prisma);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
