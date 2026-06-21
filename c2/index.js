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

app.post('/c2', async (req, res) => {
	if (!req.body || !req.body.product_id || !req.body.quantity) {
		return res.status(422).json({ success: false, message: 'Missing product_id or quantity' });
	}
	const productId = parseInt(req.body.product_id);
	const quantity = parseInt(req.body.quantity);

	if (isNaN(productId) || isNaN(quantity)) {
		return res.status(422).json({ success: false, message: 'Invalid product_id or quantity' });
	}

	if (quantity <= 0) {
		return res.status(422).json({ success: false, message: 'Quantity must be greater than 0' });
	}

	const product = await prisma.product.findUnique({
		where: { id: productId },
	});

	if (!product) {
		return res.status(404).json({ success: false, message: 'Product not found' });
	}

	if (product.stock < quantity) {
		return res.status(400).json({ success: false, remaining_stock: product.stock });
	}

	const updatedProduct = await prisma.product.update({
		where: { id: productId },
		data: { stock: product.stock - quantity },
	});

	return res.json({ success: true, remaining_stock: updatedProduct.stock });
});

app.listen(3000, () => {
	console.log(`Server running on http://localhost:3000`);
});
