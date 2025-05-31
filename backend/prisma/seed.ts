import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting seed...');
  try {
    await prisma.user.deleteMany();
    await prisma.merchant.deleteMany();
    await prisma.establishment.deleteMany();

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

    const merchants = await Promise.all(
      Array.from({ length: 5 }).map(async (_, index) => {
        const merchant = await prisma.merchant.create({
          data: {
            name: `Merchant ${index + 1}`,
            municipality: ['Bogotá', 'Medellín', 'Cali', 'Bucaramanga', 'Cartagena'][Math.floor(Math.random() * 5)],
            phone: `+57${Math.floor(Math.random() * 1000000000)
              .toString()
              .padStart(10, '0')}`,
            email: `merchant${index + 1}@example.com`,
            status: 'ACTIVE',
            registeredById: adminUser.id,
            updatedById: adminUser.id,
          },
        });
        return merchant;
      }),
    );

    await Promise.all(
      Array.from({ length: 10 }).map(async (_, index) => {
        const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
        await prisma.establishment.create({
          data: {
            name: `Establishment ${index + 1}`,
            revenue: Math.floor(Math.random() * 1000000) + 10000,
            employeeCount: Math.floor(Math.random() * 50) + 1,
            ownerId: randomMerchant.id,
            registeredById: Math.random() > 0.5 ? adminUser.id : assistantUser.id,
            updatedById: Math.random() > 0.5 ? adminUser.id : assistantUser.id,
          },
        });
      }),
    );

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error in seed:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => {
    prisma.$disconnect();
  });
