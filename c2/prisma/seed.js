import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.ts';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	try {
		await prisma.product.deleteMany();

		await prisma.product.createMany({
			data: [
				{ name: 'Product A', stock: 10 },
				{ name: 'Product B', stock: 50 },
				{ name: 'Product C', stock: 0 },
			],
		});
	} catch (error) {
		console.error('Error seeding the database:', error);
		return process.exit(1);
	}

	console.log('Database seeded successfully');
}

main();
