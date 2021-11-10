const express = require('express');
const app = express()
const axios = require("axios");
var cors = require("cors");
app.use(cors());

const baseURL = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-16/Node-1/Data/la";
//const baseURL = "https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-16/Node-1/Data?rcn=4";

const apiParameters = {
	headers: {
		"X-M2M-Origin": "SXm01ptJUq:agmdVRzCso",
		"Accept": "application/json"
	}
};

app.get('/latestEntry', (req, res) => {

	axios
	.get(baseURL, apiParameters)
	.then(response => {
		res.send(response.data);
		})
	.catch((error) => console.log(error))
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log("Server on Port ", PORT);
});
