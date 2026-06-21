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

app.post('/c3', async (req, res) => {
	if (!req.body || !req.body.player_name || !req.body.score) {
		return res.status(422).json({ success: false, message: 'Missing player_name or score' });
	}
	const playerName = req.body.player_name;
	const score = parseInt(req.body.score);

	if (isNaN(score)) {
		return res.status(422).json({ success: false, message: 'Invalid score' });
	}

	const existingPlayer = await prisma.score.findFirst({
		where: { player_name: playerName },
	});

	if (existingPlayer) {
		return res.status(400).json({ success: false, message: 'Player already exists' });
	}

	const newPlayer = await prisma.score.create({
		data: {
			player_name: playerName,
			score: score,
		},
	});

	return res.status(201).json(newPlayer);
});

app.get('/c3', async (req, res) => {
	const topPlayers = await prisma.score.findMany({
		orderBy: { score: 'desc' },
	});

	// add rank field to each player based on their position in the sorted list
	topPlayers.forEach((player, index) => {
		player.rank = index + 1;
		player.id = undefined;
	});

	return res.json(topPlayers);
});

app.listen(3000, () => {
	console.log(`Server running on http://localhost:3000`);
});
