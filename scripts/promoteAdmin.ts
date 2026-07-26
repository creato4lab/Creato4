import 'dotenv/config';
import prisma from '../src/lib/prisma';

async function main() {
  const emailToPromote = 'princetagadiya99@gmail.com';

  const user = await prisma.user.findUnique({
    where: { email: emailToPromote }
  });

  if (!user) {
    console.error(`User with email ${emailToPromote} not found.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { email: emailToPromote },
    data: { role: 'ADMIN' }
  });

  console.log(`✅ Success: ${emailToPromote} has been promoted to ADMIN.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
