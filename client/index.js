const express = require('express')
const app = express()
const port = 3000
const exec = require('child_process').exec;
const bodyParser = require('body-parser')

app.use(bodyParser.text());

const path = require('path')
app.use(express.static(path.join(__dirname, 'public/PixelCraft')))

app.post('/publish', function(req, res) {
    console.log(req.body);
    exec("echo " + req.body + " > out.txt", function callback(error, stdout, stderr) {
      console.log(error);
      console.log(stderr);
      console.log(stdout);
    });
    res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Glaum Matrix Client listening at http://localhost:${port}`)
})