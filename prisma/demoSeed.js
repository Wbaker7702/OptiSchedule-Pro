const STORE_NUMBER = "2080";
const EMPLOYEE_COUNT = 40;
const SHIFT_HISTORY_DAYS = 30;

function getDemoBirthdate(employeeIndex) {
  const birthYear = 1985 + (employeeIndex % 30);
  return new Date(birthYear, 5, 15);
}

function getMinorCutoff(today = new Date()) {
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
}

function isMinorOn(birthdate, cutoff18) {
  return birthdate > cutoff18;
}

async function seedDemoStore(prisma) {
  console.log("🌱 Seeding Store 2080 (Battle Creek, MI)...");

  // 1️⃣ Upsert Store by storeNumber (unique field)
  const store = await prisma.store.upsert({
    where: { storeNumber: STORE_NUMBER },
    update: {},
    create: {
      storeNumber: STORE_NUMBER,
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
  const cutoff18 = getMinorCutoff();

  for (let i = 1; i <= EMPLOYEE_COUNT; i++) {
    const birthdate = getDemoBirthdate(i);

    const employee = await prisma.employee.create({
      data: {
        firstName: `Employee${i}`,
        birthdate: birthdate,
        isMinor: isMinorOn(birthdate, cutoff18),
        storeId: store.id,
      },
    });

    employees.push(employee);
  }

  console.log(`👥 Created ${EMPLOYEE_COUNT} employees`);

  // 4️⃣ Create 30 days of shifts
  const now = new Date();

  for (let day = 0; day < SHIFT_HISTORY_DAYS; day++) {
    for (const emp of employees) {
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

  console.log(`📅 Created ${SHIFT_HISTORY_DAYS} days of shift history`);
  console.log("🎉 Seed complete.");
}

module.exports = {
  getDemoBirthdate,
  getMinorCutoff,
  isMinorOn,
  seedDemoStore,
};
