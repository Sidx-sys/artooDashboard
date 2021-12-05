const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())

// app.use((req, res, next) => setTimout(next, 1000));


const PORT = 6969;
let isOn = false;


app.get('/', (req, res) => {
    return res.send(isOn ? 'ON' : 'OFF');
});

app.get('/flipPower', (req, res) => {
    isOn = !isOn;
    return res.send(isOn ? 'ON' : 'OFF');
});

app.listen(PORT, () => {console.log(`Serving dummy ESP on port ${PORT}`);});