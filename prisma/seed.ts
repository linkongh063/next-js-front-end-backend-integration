import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.deleteMany(); // optional for clean seed

    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                name: 'Test User' + i,
                email: 'user' + i + '@example.com',
            },
});
    }

console.log('🌱 Seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
