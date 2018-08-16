define(function(require, exports, module) {
	// 引入工具
	var tools = require("modules/tools/tools");
	// 引入format
	var format = tools.format;

	// 因为使用的是MVC框架, 所以我们要按照框架提供的功能去书写

	// 第一步  添加模型
	MVC.addModel("bg_m", {
		arr: ["bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg", "bg5.jpg", "bg6.jpg"],
		idx: parseInt(Math.random() * 6)
	})
	// 第二步  添加视图
	MVC.addView("bg_v", function(M) {
		// 创建视图7步走
		// 1 获取容器元素
		var bg = document.getElementById("bg");
		// 2 获取数据
		var data = M.get("bg_m");
		// 3 定义模板
		var tpl = [
			"<ul>",
				"<%li_tpl%>",
			"</ul>"
		].join("");
		// 3.1 定义小模板
		var li_tpl = "<li class='<%active%>'><img src='./images/art/<%aaa%>' /></li>";
		// 4 定义变量 
		var html = "";
		var li_html = "";
		// 5 格式化
		// 5.1 格式化小模板
		for(var i = 0; i < data.arr.length; i++) {
			li_html += format(li_tpl, {
				active: i === data.idx ? "active" : "",
				aaa: data.arr[i]
			})
		}
		// 5.2 格式化大模板
		html = format(tpl, {
			li_tpl: li_html
		})
		// 6 填充容器
		bg.innerHTML = html;
		// 7 返回容器
		return bg;
	})
	// 第三步  添加控制器
	MVC.addCtrl("bg_c", function(M, V) {
		// 获取创建好的元素
		var dom = V.create("bg_v");
		// 获取数据
		var data = M.get("bg_m");
		// 获取元素lis
		var $lis = $(dom).find("li");
		// 设置信号量
		var idx = data.idx;
		// 设置上限
		var max = data.arr.length;
		// 设置定时器   不停更换类， 并且进行动画
		setInterval(function() {
			// 老图淡出
			$lis.eq(idx).animate({opaticy: 0}, 1500);
			// 信号量改变
			idx++;
			if(idx >= max) {
				idx = 0;
			}
			// 新图淡入
			$lis.eq(idx).animate({opaticy: 1}, 1500);	
		}, 5000);
	})
})

