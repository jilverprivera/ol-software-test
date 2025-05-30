import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create 2 users (one for each role)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMINISTRATOR',
    },
  });

  const assistantUser = await prisma.user.create({
    data: {
      name: 'Assistant User',
      email: 'assistant@example.com',
      password: await bcrypt.hash('assistant123', 10),
      role: 'REGISTRATION_ASSISTANT',
    },
  });

  // Create 5 merchants
  const merchants = await Promise.all(
    Array.from({ length: 5 }).map(async (_, index) => {
      return prisma.merchant.create({
        data: {
          name: `Merchant ${index + 1}`,
          municipality: [
            'Bogotá',
            'Medellín',
            'Cali',
            'Barranquilla',
            'Cartagena',
          ][Math.floor(Math.random() * 5)],
          phone: `+57${Math.floor(Math.random() * 1000000000)
            .toString()
            .padStart(10, '0')}`,
          email: `merchant${index + 1}@example.com`,
          status: Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE',
          registeredById: adminUser.id,
          updatedById: adminUser.id,
        },
      });
    }),
  );

  // Create 10 establishments with random distribution among merchants
  await Promise.all(
    Array.from({ length: 10 }).map(async (_, index) => {
      const randomMerchant =
        merchants[Math.floor(Math.random() * merchants.length)];
      return prisma.establishment.create({
        data: {
          name: `Establishment ${index + 1}`,
          revenue: Math.floor(Math.random() * 1000000) + 10000, // Random revenue between 10,000 and 1,010,000
          employeeCount: Math.floor(Math.random() * 50) + 1, // Random number of employees between 1 and 50
          ownerId: randomMerchant.id,
          registeredById: Math.random() > 0.5 ? adminUser.id : assistantUser.id,
          updatedById: Math.random() > 0.5 ? adminUser.id : assistantUser.id,
        },
      });
    }),
  );

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
