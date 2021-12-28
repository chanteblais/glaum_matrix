
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

app.use(bodyParser.text());

const path = require('path')

const args = process.argv.slice(2);
var matrix;

if (!args[0] || args[0] != "dev") {
  const GlaumMatrix = require('./matrix.js')
  matrix = new GlaumMatrix()
}



app.use(express.static(path.join(__dirname, 'public/PixelCraft')))

app.post('/publish', function (req, res) {
  canvasArray = req.body.split(",")

  if (matrix) {
    matrix.draw(canvasArray);
  }

  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Glaum Matrix Client listening at http://localhost:${port}`)
})

