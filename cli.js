import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import inquirer from 'inquirer';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

// --- ACTION FUNCTIONS ---

async function viewTasks() {
  const tasks = await prisma.task.findMany();
  if (tasks.length === 0) {
    console.log("\n📭 Your schedule is empty.\n");
  } else {
    console.log("\n📋 Current Tasks:");
    console.table(tasks);
  }
}

async function addTask() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'taskName',
      message: 'What is the name of the new task?'
    }
  ]);
  
  if (answer.taskName.trim() === '') {
    console.log("⚠️ Task name cannot be empty.");
    return;
  }

  await prisma.task.create({
    data: { name: answer.taskName }
  });
  console.log(`\n✅ Successfully added: "${answer.taskName}"\n`);
}

async function completeTask() {
  const tasks = await prisma.task.findMany({ where: { status: 'PENDING' } });
  if (tasks.length === 0) {
    console.log("\n🎉 No pending tasks to complete!\n");
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'taskId',
      message: 'Which task did you finish?',
      choices: tasks.map(t => ({ name: t.name, value: t.id }))
    }
  ]);

  await prisma.task.update({
    where: { id: answer.taskId },
    data: { status: 'COMPLETED' }
  });
  console.log(`\n✅ Task marked as completed!\n`);
}

async function deleteTask() {
  const tasks = await prisma.task.findMany();
  if (tasks.length === 0) {
    console.log("\n📭 No tasks to delete.\n");
    return;
  }

  const answer = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'taskId',
      message: 'Which task do you want to delete?',
      choices: tasks.map(t => ({ name: t.name, value: t.id }))
    }
  ]);

  await prisma.task.delete({
    where: { id: answer.taskId }
  });
  console.log(`\n🗑️ Task deleted!\n`);
}

// --- MAIN LOOP ---

async function startApp() {
  console.clear();
  console.log("====================================");
  console.log("   🚀 OptiSchedule-Pro (v2.0)       ");
  console.log("====================================\n");

  let isRunning = true;

  while (isRunning) {
    const answer = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'action',
        message: 'Main Menu:',
        choices: [
          '👀 View Tasks',
          '➕ Add a Task',
          '✅ Complete a Task',
          '🗑️ Delete a Task',
          '🚪 Exit'
        ]
      }
    ]);

    switch (answer.action) {
      case '👀 View Tasks': await viewTasks(); break;
      case '➕ Add a Task': await addTask(); break;
      case '✅ Complete a Task': await completeTask(); break;
      case '🗑️ Delete a Task': await deleteTask(); break;
      case '🚪 Exit':
        isRunning = false;
        console.log("\nClosing OptiSchedule-Pro. Have a great day! 👋\n");
        break;
    }
  }
  
  await prisma.$disconnect();
}

startApp();
