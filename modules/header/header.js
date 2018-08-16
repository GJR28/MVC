define(function(require, exports, module) {
	// 引入模块
	var tools = require("modules/tools/tools");
	// format
	var format = tools.format;
	// 添加视图
	MVC.addView("header_v", function(M) {
		// 创建视图 7步
		// 1 获取容器元素
		var dom = document.getElementById("header");
		// 2 获取数据
		var data = M.get("header_m");
		// 3 定义模板
		var tpl = [
			'<div class="container">',
				'<div class="top clearfix">',
					'<div class="logo fl">',
						'<img src="<%logo%>" alt="" />',
					'</div>',
					'<ul class="fr clearfix"><%icon_tpl%></ul>',
				'</div>',
				'<ul class="nav clearfix"><%nav_tpl%></ul>',
			'</div>'
		].join("");
		// 3.1 定义小模板 图标小模板
		var icon_tpl = '<li class="fl"><a href="<%href%>"><img src="<%img%>" alt="" /></a></li>';
		// 3.2 定义小模板 导航小模板
		var nav_tpl = '<li class="fl item"><a href="<%href%>"><%title%></a><ul><%sub_nav_tpl%></ul></li>';
		// 3.3 定义小小模板  下拉列表
		var sub_nav_tpl = '<li><a href="<%href%>"><%title%></a></li>';
		// 4 定义变量
		var html = "";
		var icon_html = "";
		var nav_html = "";
		// 5 格式化
		// 5.1 格式化小模板icon_tpl
		var icon_arr = data.icon;
		for(var i = 0; i < icon_arr.length; i++) {
			icon_html += format(icon_tpl, icon_arr[i])
		}
		// 5.2 格式化小模板nav_tpl
		var nav_arr = data.nav;
		for(var i = 0; i < nav_arr.length; i++) {
			// 定义sub_nav_html 
			var sub_nav_html = '';
			// 先格式化小小模板
			nav_arr[i].list && nav_arr[i].list.forEach(function(value, index) {
				sub_nav_html += format(sub_nav_tpl, value);
			})
			nav_html += format(nav_tpl, {
				href: nav_arr[i].href,
				title: nav_arr[i].title,
				sub_nav_tpl: sub_nav_html
			})
		}
		// 5.3 格式化大模板tpl
		html = format(tpl, {
			logo: data.logo,
			icon_tpl: icon_html,
			nav_tpl: nav_html
		})
		// 6 填充容器
		dom.innerHTML = html;
		// 7 返回容器
		return dom;

	})
	// 添加控制器
	MVC.addCtrl("header_c", function(M, V) {
		// 发送ajax
		$.ajax({
			url: "/data/header.json",
			type: "get",
			dataType: "json",
			success: function(data) {
				console.log(data);
				// 将数据添加到M层
				M.add("header_m", data);
				// 创建视图
				var dom = V.create("header_v");
				// 获取元素
				var $items = $(dom).find(".item");
				// 进入事件
				$items.mouseenter(function() {
					$(this).children("ul").slideDown(500);
				})
				// 离开事件
				$items.mouseleave(function() {
					$(this).children("ul").slideUp(500);
				})
			}
		})
	})
})