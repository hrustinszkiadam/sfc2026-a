import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.ts';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	try {
		await prisma.loan.deleteMany();
		await prisma.book.deleteMany();
		await prisma.member.deleteMany();

		await prisma.book.createMany({
			data: [
				{ title: '1984', author: 'George Orwell', category: 'science_fiction' },
				{ title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'history' },
				{ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'romance' },
				{ title: 'Pride and Prejudice', author: 'Jane Austen', category: 'romance' },
				{ title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'fantasy' },
			],
		});

		await prisma.member.createMany({
			data: [
				{ name: 'Alice Johnson', email: 'alice@example.com' },
				{ name: 'Bob Smith', email: 'bob@example.com' },
				{ name: 'Charlie Brown', email: 'charlie@example.com' },
				{ name: 'David Wilson', email: 'david@example.com' },
				{ name: 'Eve Davis', email: 'eve@example.com' },
			],
		});

		const books = await prisma.book.findMany();
		const members = await prisma.member.findMany();

		const loans = await prisma.loan.createMany({
			data: [
				{
					book_id: books[0].id,
					member_id: members[0].id,
					loan_date: new Date('2024-01-01'),
					return_date: new Date('2024-01-15'),
				},
				{
					book_id: books[1].id,
					member_id: members[0].id,
					loan_date: new Date('2024-02-01'),
					return_date: new Date('2024-02-15'),
				},
				{
					book_id: books[2].id,
					member_id: members[2].id,
					loan_date: new Date('2024-03-01'),
					return_date: new Date('2024-03-15'),
				},
				{
					book_id: books[3].id,
					member_id: members[3].id,
					loan_date: new Date('2024-04-01'),
					return_date: new Date('2024-04-15'),
				},
				{
					book_id: books[4].id,
					member_id: members[4].id,
					loan_date: new Date('2024-05-01'),
				},
			],
		});
	} catch (error) {
		console.error('Error seeding the database:', error);
		return process.exit(1);
	}

	console.log('Database seeded successfully');
}

main();
