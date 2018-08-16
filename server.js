// 引入模块
var http = require("http");
var fs = require("fs");
var url = require("url");

var MIMEType = {
	"html": "text/html",
	"css": "text/css",
	"js": "text/javascript",
	"jpg": "image/jpeg",
	"png": "image/png"
}
// 创建服务器
var server = http.createServer(function(req, res) {
	var url_obj = url.parse(req.url);
	var pathname = url_obj.pathname;
	
	// 强制读取文件
	fs.readFile("." + pathname, function(err, data) {
		if(err) {
			res.setHeader("content-type", "text/plain;charset=utf-8");
			res.end("抱歉， 你读取的" + pathname + "不存在");
			return;
		}
		var extName = pathname.split(".").pop();
		res.setHeader("content-type", MIMEType[extName] + ";charset=utf-8");
		res.end(data);
	})
})

// 监听端口号
server.listen(3000);