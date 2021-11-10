import './App.css';
import axios from "axios";
import React, { useState } from 'react';
import Chart from './Components/Chart';

const App = () => {
	const [leftScan, setLeftScan] = useState([])
	const [middleScan, setMiddleScan] = useState([])
	const [rightScan, setRightScan] = useState([])

	const requestData = async(event) =>{
		event.preventDefault();
		try
		{
			const response = await axios.get('http://localhost:5000/latestEntry');
			setLeftScan(response.data.leftScan);
			setRightScan(response.data.rightScan);
			setMiddleScan(response.data.midScan);
		}
		catch(e)
		{
			console.error(e);
		}
	}

	return (
		<div className="App">
		<button onClick={requestData} type="button">Refresh Readings</button>
		<Chart leftScan={leftScan} rightScan={rightScan} middleScan={middleScan}/>
		</div>
	);
}

export default App;
