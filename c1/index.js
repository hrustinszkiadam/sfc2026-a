import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/c1', (req, res) => {
	const { code } = req.query;

	const codeRegex = /^[A-Z]{4}\d{4}$/;

	// 3. Test the code (default to false if code is undefined)
	const isValid = code ? codeRegex.test(code) : false;

	// 4. Return the JSON response
	res.json({ valid: isValid });
});

app.listen(3000, () => {
	console.log(`Server running on http://localhost:3000`);
});
