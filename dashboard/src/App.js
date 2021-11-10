import './App.css';
import Axios from "axios";
import React, { useState } from 'react'
const aesjs = require('aes-js');

const App = () => {

	const IV = 'JqPBNtyfDbPhcFsH';
	const Key = 'RwmD5h7JUYdErsy9';
	const iv = [...IV].map(c => c.charCodeAt(0));
	const key = [...Key].map(c => c.charCodeAt(0));

	const [leftSensor, setLeftSensor] = useState('0.0')
	const [middleSensor, setMiddleSensor] = useState('0.0')
	const [rightSensor, setRightSensor] = useState('0.0')

	const decrypt = (data) => {
		const buffer = Buffer.from(data, 'base64');
		const encryptedHex = buffer.toString('hex');
		const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

		var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
		var decryptedBytes = aesCbc.decrypt(encryptedBytes);

		var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
		console.log(decryptedText);

		var entry = "";
		[...decryptedText.trim()].every(ch => {
			if (ch === '|') return false;

			entry += ch;
			return true;
		})

		var values = entry.split(/\s+/);
		setLeftSensor(values[0])
		setMiddleSensor(values[1])
		setRightSensor(values[2])
	}


	const requestData = (event) => {

		event.preventDefault();

		Axios
		.get("http://localhost:8080/latestEntry")
		.then((res) => {decrypt(res.data["m2m:cin"].con)});
		//.then((res) => {console.log(res.data["m2m:cnt"]["m2m:cin"].pop().con)});
		//.then((res) => {decrypt(res.data["m2m:cnt"]["m2m:cin"].pop().con)});
	}

	return (
		<div className="App">
		<button onClick={requestData} type="button">Refresh Readings</button>
		<div className="sensors">
			<p>Left Sensor: {leftSensor} m</p>
			<p>Middle Sensor: {middleSensor} m</p>
			<p>Right Sensor: {rightSensor} m</p>
		</div>
		</div>
	);
}

export default App;
