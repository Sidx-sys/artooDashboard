import './App.css';
import axios from "axios";
import React, { useState } from 'react';
import Chart from './Components/Chart';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
	const [leftScan, setLeftScan] = useState([]);
	const [middleScan, setMiddleScan] = useState([]);
	const [rightScan, setRightScan] = useState([]);
	
	const [ip, setIp] = useState("");
	const [connected, setConntected] = useState(false);
	const [isOn, setIsOn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [chartLoading, setChartLoading] = useState(false);

	const requestData = async() =>{
		try
		{
			setChartLoading(true);
			const response = await axios.get('http://localhost:5000/latestEntry');
			setLeftScan(response.data.leftScan);
			setRightScan(response.data.rightScan);
			setMiddleScan(response.data.midScan);
		}
		catch(e)
		{
			console.error(e);
		}
		finally 
		{
			setChartLoading(false);
		}
	};

	const tryConnect = async() => {
		try{
			setLoading(true);
			const response = await axios.get(`http://${ip}/`);
			console.log(response)
			if(response.data){
				setConntected(true);
				setIsOn(response.data === 'ON' ? true : false);
			}
			requestData();
		}
		catch(e)
		{
			console.log(e);
		}
		finally
		{
			setLoading(false);
		}
	};

	const getOn = async () => {
		try{
			const response = await axios.get(`http://${ip}/flipPower`);
			setIsOn(response.data === 'ON' ? true : false);
		}
		catch(e){
			console.log(e);
		}
	};

	const handleDisconnect = () => {

		setIp("");
		setConntected(false);

	};

	return (
		<div className="App my-4">
		<h1 className='display-4 text-center'>OA Robot Dashboard</h1>
		<hr/>
		{
		(!connected) ?
			<div className="mt-5 d-flex flex-column align-items-center">
				<label htmlFor="ip">Enter Device IP</label>
				<input className='form-control' style={{ width: 300 }} type="text" name="ip" id="ip" value={ip} onChange={({ target }) => setIp(target.value)} />
				{
					loading ? <p>Connecting...</p> : 
					<button className="btn btn-success my-2" style={{ width: 100 }} onClick={tryConnect}>Connect</button>
				}
			</div>
			:
			<>
				<div className='d-flex flex-column align-items-center mt-3 mb-1'>
					<button className="btn btn-danger mb-3" onClick={handleDisconnect}>Disconnect</button>
					<div class="card" style={{ width: "20rem" }}>
						<div class="card-body">
							<div className='d-flex flex-column align-items-center'>
								<p className='lead'>Robot Status - {isOn ? "On" : "Off"}</p>
								<div className="form-check form-switch">
									<input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isOn} onChange={getOn} />
								</div>
							</div>
						</div>
					</div>
				</div>

						<Card
							style={{
								width: '1300px',
								marginLeft: '110px',
								marginTop: '15px'
							}}>

							{
								chartLoading ? 
									<div className="d-flex flex-row justify-content-center my-5">
										<div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
									</div>

								:
								<>
										<div className='d-flex flex-row justify-content-center mt-3 mb-1'>
											<button onClick={requestData} className='btn btn-outline-primary' style={{ width: 200 }} type="button">Refresh Readings</button>
										</div>
										<Chart leftScan={leftScan} rightScan={rightScan} middleScan={middleScan} />
										<Card.Body>
											<Card.Title>Sensor Data (Sensor Distance (metres) Vs Time(s))</Card.Title>
											<Card.Text>
												<p className="lead">
													Graphical representation showing sensor distance from the 3 sensors w.r.t time.
												</p>
											</Card.Text>
										</Card.Body>
								</>
							}
						</Card>
			</>
		}
		</div>
	);
}

export default App;
