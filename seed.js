const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Store 2080 (Battle Creek, MI)...");

  // Create store (storeNumber is unique, id is auto)
  const store = await prisma.store.upsert({
    where: { storeNumber: "2080" },
    update: {},
    create: {
      storeNumber: "2080",
      city: "Battle Creek",
      state: "MI",
    },
  });

  console.log("✅ Store ready:", store.storeNumber);

  // Clean old demo data using store.id (NOT storeNumber)
  await prisma.shift.deleteMany({
    where: { storeId: store.id },
  });

  await prisma.employee.deleteMany({
    where: { storeId: store.id },
  });

  console.log("🧹 Cleared old demo data");

  const departments = [
    "Front End",
    "Grocery",
    "Electronics",
    "OGP",
    "Stocking",
  ];

  // Create 40 employees
  for (let i = 1; i <= 40; i++) {
    await prisma.employee.create({
      data: {
        name: `Employee ${i}`,
        department: departments[i % departments.length],
        role: i <= 5 ? "manager" : "associate",
        storeId: store.id,
      },
    });
  }

  console.log("👥 40 employees created");

  const employees = await prisma.employee.findMany({
    where: { storeId: store.id },
  });

  const now = new Date();

  // 30 days of shifts
  for (let day = 0; day < 30; day++) {
    for (let emp of employees) {
      const start = new Date(now);
      start.setDate(now.getDate() - day);
      start.setHours(8 + (emp.id % 3), 0, 0, 0);

      const end = new Date(start);
      end.setHours(start.getHours() + 8);

      await prisma.shift.create({
        data: {
          employeeId: emp.id,
          storeId: store.id,
          startTime: start,
          endTime: end,
          status: Math.random() < 0.05 ? "MISSED" : "COMPLETED",
        },
      });
    }
  }

  console.log("📅 Shifts generated");
  console.log("🔥 Seed complete.");
const { seedDemoStore } = require("./prisma/demoSeed");

const prisma = new PrismaClient();

async function main() {
  await seedDemoStore(prisma);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
