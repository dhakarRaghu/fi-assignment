import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('mypassword', 10);
  
  await prisma.user.upsert({
    where: { username: 'puja' },
    update: {},
    create: {
      username: 'puja',
      password: hashedPassword,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'PHN-001' },
    update: {},
    create: {
      name: 'Phone',
      type: 'Electronics',
      sku: 'PHN-001',
      image_url: 'https://example.com/phone.jpg',
      description: 'Latest Phone',
      quantity: 5,
      price: 999.99,
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });