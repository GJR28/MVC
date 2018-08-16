define(function(require, exports, module) {
	// 引入工具模块
	var tools = require("modules/tools/tools");
	// 引入格式化函数
	var format = tools.format;
	// 添加视图
	MVC.addView("portfolio_V", function(M) {
		// 创建视图分7步
		// 1 获取容器元素
		var dom = document.getElementById("portfolio");
		// 2 获取数据
		var data = M.get("portfolio_M");
		// 3 定义模板
		var tpl = [
			'<div class="container">',
				'<h2 class="title"><%title%></h2>',
				'<p class="content"><%content%></p>',
				'<div class="category"><span class="filter">FILTER:</span><%cat_tpl%></div>',
				'<ul id="list"></ul>',
			'</div>'
		].join("");
		// 3.1 定义小模板
		var cat_tpl = '<span class="<%active%> item"><%key%></span>';
		// 4 定义变量
		var html = "";
		var cat_html = "";
		// 5 格式化
		for(var i in data.filter) {
			cat_html += format(cat_tpl, {
				active: i === "All" ? "active" : "",
				key: i
			})
		}
		// 5.1 格式化大模板
		html = format(tpl, {
			cat_tpl: cat_html,
			title: data.title, 
			content: data.content 
		})
		// 6 填充容器
		dom.innerHTML = html;
		// 7 返回容器
		return dom;
	})
	// 添加控制器
	MVC.addCtrl("portfolio_C", function(M, V) {
		// 发送ajax
		$.ajax({
			url: "/data/portfolio.json", 
			type: "get",
			dataType: "json",
			success: function(data) {
				// console.log(data);
				// 数据请求回来了, 加入到M层中
				M.add("portfolio_M", data);
				// 创建视图
				var dom = V.create("portfolio_V");
				// 创建高度映射数组
				var height_arr = [0, 0, 0, 0, 0];
				// 获取元素
				var $list = $(dom).find("#list");
				// 获取所有的图片
				var img_arr = data.filter.All;
				console.log(img_arr);
				// 定义四个数组
				var all_arr = [];
				var categoryI_arr = [];
				var categoryII_arr = [];
				var video_arr = [];

				// 循环加载所有的图片
				img_arr.forEach(function(value, index) {
					// 创建li元素
					var li = document.createElement("li");
					// 因为所有的图片都在all里面， 所以不必判断
					all_arr.push(li);
					// 判断 是否属于categoryI数组中的内容
					data.filter.CategoryI.indexOf(value) === -1 ? "" : categoryI_arr.push(li);
					// 判断 是否属于categoryII数组中的内容
					data.filter.CategoryII.indexOf(value) === -1 ? "" : categoryII_arr.push(li);
					// 判断 是否属于video数组中的内容
					data.filter.Video.indexOf(value) === -1 ? "" : video_arr.push(li);


					// 创建img元素
					var img = new Image();
					// 设置src属性
					img.src = "images/art/" + value + ".jpg";

					// 设置img 的onload事件
					img.onload = function() {
						// 上树
						li.appendChild(this);
						// 获取数组中最小项的下标
						var minIdx = getMinIdx(height_arr);
						// 设置li的样式
						$(li).css({
							position: "absolute",
							left: minIdx * 184,
							top: height_arr[minIdx] + 20
						})
						// 上树
						$list.append(li);
						// 高度数组发生改变
						height_arr[minIdx] += this.height + 20;
						// 改变父元素的高度
						$list.css({
							height: Math.max.apply("", height_arr)
						})
					}
				}) 

				// 获取点击按钮
				var $all = $(dom).find(".item").eq(0);
				var $categoryI = $(dom).find(".item").eq(1);
				var $categoryII = $(dom).find(".item").eq(2);
				var $video = $(dom).find(".item").eq(3);

				// 绑定事件   显示图片
				$all.click(function() {
					animate(all_arr, all_arr);
				})
				$categoryI.click(function() {
					animate(all_arr, categoryI_arr);
				})
				$categoryII.click(function() {
					animate(all_arr, categoryII_arr);
				})
				$video.click(function() {
					animate(all_arr, video_arr);
				})


				// 定义animate函数
				function animate(all, target) {
					// 获取差值数组   返回的是在all数组中， 但是不在target数组中的数据
					var newArr = _.difference(all, target);
					// 将不属于数组中的li元素都隐藏
					newArr.forEach(function(value, index) {
						$(value).animate({opacity: 0}, 1000)
					})

					// 先将高度数组清空
					height_arr.fill(0);
					// 将属于数组中的li元素都重新排序
					target.forEach(function(value, index) {
						// 获取最矮的列
						var minIdx = getMinIdx(height_arr);
						$(value).animate({
							left: minIdx * 184,
							top: height_arr[minIdx],
							opacity: 1
						}, 1000)
						height_arr[minIdx] += $(value).height() + 20;
					})

				}

				// 定义一个函数， 获取数组中最小项下标
				function getMinIdx(arr) {
					// 默认第一项下标最小
					var minIdx = 0;
					// 默认第一项最小
					var min = arr[0];
					// 循环比较
					for(var i = 0; i < arr.length; i++) {
						if(min > arr[i]) {
							min = arr[i];
							minIdx = i;
						}
					}
					// 循环结束， 返回最小项下标
					return minIdx;
				}
			}
		})
	})
})