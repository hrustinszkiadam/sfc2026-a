import express from 'express';
import cors from 'cors';
import { Jimp } from 'jimp';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/c4', async (req, res) => {
	const { channel } = req.query;

	if (!channel) {
		return res.status(422).json({ error: 'Channel parameter is required' });
	}
	if (!['red', 'green', 'blue'].includes(channel)) {
		return res
			.status(422)
			.json({ error: 'Invalid channel value. Must be one of: red, green, blue' });
	}

	const imagePath = fileURLToPath(new URL('assets/sample.jpg', import.meta.url));

	// 3. Read the image into memory
	const image = await Jimp.read(imagePath);

	// 4. Scan and manipulate the raw pixel data
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
		if (channel === 'red') {
			this.bitmap.data[idx + 1] = 0; // Zero out Green
			this.bitmap.data[idx + 2] = 0; // Zero out Blue
		} else if (channel === 'green') {
			this.bitmap.data[idx] = 0; // Zero out Red
			this.bitmap.data[idx + 2] = 0; // Zero out Blue
		} else if (channel === 'blue') {
			this.bitmap.data[idx] = 0; // Zero out Red
			this.bitmap.data[idx + 1] = 0; // Zero out Green
		}
	});

	const buffer = await image.getBuffer('image/jpeg');

	res.setHeader('Content-Type', 'image/jpeg');
	return res.send(buffer);
});

app.listen(3000, () => {
	console.log(`Server running on http://localhost:3000`);
});
