const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!\n')
})

var port = 80
if (!process.env.SYSTEM)
  port = 5001

app.listen(port)
