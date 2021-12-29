
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const port = 3000
const app = express()
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public/PixelCraft')))

// Initialize
const args = process.argv.slice(2);

var simulatorData;
var matrix;
if (!args[0] || args[0] != "dev") {
  const GlaumMatrix = require('./matrix.js')
  matrix = new GlaumMatrix()
}

// Endpoints
app.post('/publish', function (req, res) {
  if (req.body) {
    if (matrix) {
      canvasArray = req.body.split(",")
      matrix.draw(canvasArray);
    }
    
    publishToSimulator(req.body);

    res.sendStatus(200);
  } else {
    console.log("Invalid body", req.body);
    res.sendStatus(400);
  }
});

var simulatorResponse;
app.get('/simulator', async function (req, res) {
  console.log('Got /simulator');
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control, last-event-id'    
  });
  res.flushHeaders();

  res.write('retry: 10000\n\n');
  simulatorResponse = res;
});

function publishToSimulator(arrayData){
  if (simulatorResponse){
    simulatorResponse.write(`event: matrixUpdate\ndata: "${arrayData}"\n\n`);
  }
}

// Setup app
app.listen(port, () => {
  console.log(`Glaum Matrix Client listening at http://localhost:${port}`)
})
