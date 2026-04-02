import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Running Prisma v7 Data Injector...");
  try {
    console.log("⏳ Creating a new task...");
    
    // Injecting the required 'name' string!
    await prisma.task.create({
      data: {
        name: "Celebrate fixing the database connection!"
      } 
    });

    // Fetch and display the data
    const data = await prisma.task.findMany({ take: 5 });
    console.table(data);
    console.log("✅ Success! You officially have data.");
    
  } catch (e) {
    console.log("\n⚠️ Error:");
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
