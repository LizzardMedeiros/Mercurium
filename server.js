var express = require("express");
app = express();
app.use(express.static('website/statics'));

app.get('/', function (req, res) {
	res.sendFile(__dirname+"/website/index.html");
});

var server = app.listen(3000);
console.log("Server started in %s", server.address().port);