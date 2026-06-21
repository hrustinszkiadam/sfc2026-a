import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.ts';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });
// includes 5 sample players; Bob and Charlie have the same score
async function main() {
	try {
		await prisma.score.deleteMany();

		await prisma.score.createMany({
			data: [
				{ player_name: 'Alice', score: 100 },
				{ player_name: 'Bob', score: 90 },
				{ player_name: 'Charlie', score: 90 },
				{ player_name: 'David', score: 80 },
				{ player_name: 'Eve', score: 70 },
			],
		});
	} catch (error) {
		console.error('Error seeding the database:', error);
		return process.exit(1);
	}

	console.log('Database seeded successfully');
}

main();
