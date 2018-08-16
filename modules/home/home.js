define(function(require, exports, module) {
	// 引入tools
	var tools = require("modules/tools/tools");
	var Observer = tools.Observer;
	// 添加控制器
	MVC.addCtrl("home", function(M, V) {
		// 发送ajax
		$.ajax({
			url: "/data/home.json",
			type: "get",
			dataType: "json",
			success: function(data) {
				console.log(data);
				console.log("数据请求回来了")
				// 数据请求回来了， 加入M层
				M.add("home_m", data.data);
				// 观察者模式 触发 发消息，告知其他模块数据请求回来了
				Observer.trigger("msg", data)
			}
		})
	})
})