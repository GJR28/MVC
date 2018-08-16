define(function(require, exports, module) {
	// 引入模块
	var tools = require("modules/tools/tools");
	// Observer
	var Observer = tools.Observer;
	// format
	var format = tools.format;
	// 添加视图
	MVC.addView("home.carousel_v", function(M) {
		// 1 获取容器元素
		var dom = document.getElementById("carousel");
		// 2 获取数据
		var data = M.get("home_m.carousel");
		// console.log(data);
		// 3 定义模板
		var tpl = [
			'<div class="container">',
				'<ul class="carousel"><%li_tpl%></ul>',
				'<ul class="cirs"><li id="leftBtn"></li><%cir_tpl%><li id="rightBtn"></li></%cir_tpl%></ul>',
				'<p class="title"><%title%></p>',
			'</div>'
		].join("");
		// 3.1 定义小模板 li_tpl
		var li_tpl = '<li class="<%active%>"><img src="<%src%>" alt="" /><p class="intro"><%intro%></p></li>';
		// 3.2 定义小模板cir_tpl
		var cir_tpl = '<li class="<%active%>"></li>';
		// 4 定义变量
		var html = "";
		var li_html = "";
		var cir_html = "";
		// 5 格式化
		// 5.1 格式化小模板li_tpl
		var list = data.list;
		// console.log(list);
		for(var i = 0; i < list.length; i++) {
			if(!i) {
				// console.log(i);
				list[i].active = "active"
			} else {
				list[i].active = "";
			}
			li_html += format(li_tpl, list[i]);
			// 5.2 格式化小模板cir_tpl
			cir_html += format(cir_tpl, {
				active: i === 0 ? "active" : ""
			});
		}
		// 5.3 格式化大模板tpl
		html = format(tpl, {
			li_tpl: li_html,
			cir_tpl: cir_html,
			title: data.title
		})
		// 填充容器
		dom.innerHTML = html;
		// 返回容器
		return dom;



	})
	// 添加控制器
	MVC.addCtrl("home.carousel", function(M, V) {
		// 观察者模式   监听
		Observer.on("msg", function() {
			// 获取视图元素
			var dom = V.create("home.carousel_v");
			var $cirs = $(dom).find(".cirs li");
			var $imgs = $(dom).find(".carousel li");
			// 转成数组
			var cirs_arr = [].slice.call($cirs, 0);
			// 获取左侧按钮
			var $leftBtn = $(cirs_arr.shift());
			// 获取右侧按钮
			var $rightBtn = $(cirs_arr.pop());

			// 定义信号量
			var idx = 0;
			// 点击左按钮事件
			$leftBtn.click(function() {
				// 老图淡出
				$imgs.eq(idx).animate({opacity: 0}, 1000);
				// 信号量改变
				idx--;
				if(idx < 0) {
					idx = cirs_arr.length - 1;
				}
				// 新图淡入
				$imgs.eq(idx).animate({opacity: 1}, 1000);
				change();

			})

			// 点击右按钮事件
			$rightBtn.click(function() {
				// 老图淡出
				$imgs.eq(idx).animate({opacity: 0}, 1000);
				// 信号量改变
				idx++;
				if(idx >= cirs_arr.length) {
					idx = 0;
				}
				// 新图淡入
				$imgs.eq(idx).animate({opacity: 1}, 1000);
				change();

			}) 

			// 循环数组中的每一项， 添加点击事件
			$.each(cirs_arr, function(index, value) {
				value.onclick = function() {
					if(idx === index) {
						return;
					}
					// 老图淡出
					$imgs.eq(idx).animate({opacity: 0}, 1000);
					// 信号量改变
					idx = index;
					// 新图淡入
					$imgs.eq(idx).animate({opacity: 1}, 1000);
					change();
				}
			})

			// 定义一个函数， 用于改变cirs的active
			function change() {
				$.each(cirs_arr, function(index, value) {
					// 判断
					if(idx === index) {
						$(value).addClass("active");
					} else {
						$(value).removeClass("active");
					}
				})
			}
		})
	})
})