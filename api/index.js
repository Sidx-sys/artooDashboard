const express = require('express');
const app = express()
const axios = require("axios");
const cors = require("cors");
const aesjs = require('aes-js');

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


const IV = 'JqPBNtyfDbPhcFsH';
const Key = 'RwmD5h7JUYdErsy9';

const iv = [...IV].map(c => c.charCodeAt(0));
const key = [...Key].map(c => c.charCodeAt(0));

const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);

const allURL = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-16/Node-2/Robo-Data?rcn=4";
const latestURL = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-16/Node-2/Robo-Data/la";

const apiParameters = {
	headers: {
		"X-M2M-Origin": "SXm01ptJUq:agmdVRzCso",
		"Accept": "application/json"
	}
};

app.get('/latestEntry', async (req, res) => {

	try {
		const response = await axios.get(latestURL, apiParameters);
		const encryptedBase64 = response.data['m2m:cin']['con'];

		const dataBuffer = Buffer.from(encryptedBase64, 'base64');
		const encryptedHex = dataBuffer.toString('hex');
		const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

		const decryptedBytes = aesCbc.decrypt(encryptedBytes);
		const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);


		const tripletStrings = decryptedText.split('|');
		const tripletsWithPadding = tripletStrings.map(triplet => triplet.split(' ').filter(item => item != '').map(num => Number(num)));
		const triplets = tripletsWithPadding.filter(trip => trip.length == 3);

		const leftScan = [];
		const midScan = [];
		const rightScan = [];
		let time = 0
		triplets.forEach(triplet => {
			leftScan.push([time, (triplet[0] != 380 ? triplet[0] : 3)]);
			midScan.push([time, (triplet[1] != 380 ? triplet[1] : 3)]);
			rightScan.push([time, (triplet[2] != 380 ? triplet[2] : 3)]);
			time += 0.1;
		});

		return res.json({ leftScan, midScan, rightScan });
	}
	catch (e) {
		console.error(e);
		return res.send("error");
	}
});

app.get('/allEntries', (req, res) => {

	axios
		.get(allURL, apiParameters)
		.then(response => {
			res.send(response.data);
		})
		.catch((error) => console.log(error))
});

app.listen(PORT, () => console.log(`Serving on Port ${PORT}`));
