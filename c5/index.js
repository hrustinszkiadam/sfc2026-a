import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/prisma/client.ts';

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

app.get('/c5', async (req, res) => {
	const { query: queryType } = req.query;

	if (!queryType) {
		return res.status(422).json({ error: 'Missing query type' });
	}

	if (queryType === '1') {
		const members = await prisma.member.findMany({
			select: {
				name: true,
				_count: {
					select: { loans: true },
				},
			},
			orderBy: {
				loans: {
					_count: 'desc',
				},
			},
		});

		const result = members.map((m) => ({
			name: m.name,
			loan_count: m._count.loans,
		}));

		return res.json(result);
	}
	if (queryType === '2') {
		const activeLoans = await prisma.loan.findMany({
			where: {
				return_date: null, // Not yet returned
			},
			select: {
				book: { select: { title: true } },
				member: { select: { name: true } },
			},
		});

		const result = activeLoans.map((loan) => ({
			title: loan.book.title,
			member_name: loan.member.name,
		}));

		return res.json(result);
	}

	if (queryType === '3') {
		const categories = await prisma.book.groupBy({
			by: ['category'],
			_count: {
				id: true,
			},
		});

		const result = categories.map((c) => ({
			category: c.category,
			book_count: c._count.id,
		}));

		return res.json(result);
	}

	return res.status(400).json({ error: 'Invalid query type' });
});

app.listen(3000, () => {
	console.log(`Server running on http://localhost:3000`);
});
