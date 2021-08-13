const express = require('express');
const app = express();

const port = 3333;

app.use(express.static("./"));

app.get('/', function (req, res) {
    res.sendFile('./index.html');
});

app.listen(port, function () {
    console.log(`Server listening on port ${port}!`);
});