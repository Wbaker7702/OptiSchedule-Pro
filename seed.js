const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Store 2080 (Battle Creek, MI)...");

  // 1️⃣ Upsert Store by storeNumber (unique field)
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

  // 2️⃣ Clear existing demo data for this store
  await prisma.shift.deleteMany({
    where: { storeId: store.id },
  });

  await prisma.employee.deleteMany({
    where: { storeId: store.id },
  });

  console.log("🧹 Cleared old demo data");

  // 3️⃣ Create Employees
  const employees = [];

  for (let i = 1; i <= 40; i++) {
    const birthYear = 1985 + (i % 30); // realistic age spread
    const birthdate = new Date(birthYear, 5, 15);

    const employee = await prisma.employee.create({
      data: {
        firstName: `Employee${i}`,
        birthdate: birthdate,
        isMinor: birthdate > new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), // dynamic minor logic
        storeId: store.id,
      },
    });

    employees.push(employee);
  }

  console.log("👥 Created 40 employees");

  // 4️⃣ Create 30 days of shifts
  const now = new Date();

  for (let day = 0; day < 30; day++) {
    for (let emp of employees) {
      const start = new Date(now);
      start.setDate(now.getDate() - day);
      start.setHours(8 + (emp.id % 3), 0, 0);

      const end = new Date(start);
      end.setHours(start.getHours() + 8);

      await prisma.shift.create({
        data: {
          employeeId: emp.id,
          storeId: store.id,
          startTime: start,
          endTime: end,
        },
      });
    }
  }

  console.log("📅 Created 30 days of shift history");
  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
