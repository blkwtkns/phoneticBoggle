var express = require("express"),
    harp = require("harp");

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(harp.mount(__dirname + "/public"));

var port = process.env.PORT || 3333;
app.listen(port, function() {
  console.log("Listening on port " + port);
});
