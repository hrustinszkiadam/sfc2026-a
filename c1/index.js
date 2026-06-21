import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/c1', (req, res) => {
	const { code } = req.query;

	const codeRegex = /^[A-Z]{4}\d{4}$/;
	const isValid = code ? codeRegex.test(code) : false;

	return res.json({ valid: isValid });
});

app.listen(3000, () => {
	console.log(`Server running on http://localhost:3000`);
});
