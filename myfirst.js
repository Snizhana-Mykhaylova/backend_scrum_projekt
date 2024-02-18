var http = require("http");

http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello world!");

    exports.myDateTime = function () {
      return Date();
    };
  })
  .listen(8080);
