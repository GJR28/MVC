define(function(require, exports, module) {
	module.exports.format = function(tpl_str, dic) {
		var result = tpl_str.replace(/<%\s*(\w+(\.\w+)*)\s*%>/g, function(match, $1, $2) {
			// 将$1转为数组
			var arr = $1.split(".");
			// 定义变量 保存字典
			var result = dic;
			// 循环数组判断
			for(var i = 0; i < arr.length -1; i++) {
				// 指向下一层
				result = result[arr[i]];
			} 
			// 返回最后一层
			return result[arr[i]];
		})
		// 返回result
		return result;
	}

	// 观察值模式: 又叫消息管道， 消息机制， 发布-订阅模式  自定义事件
	module.exports.Observer = (function() {
		// 定义观察者
		var ob = {}
		// 返回接口
		return {
			// 监听事件
			on: function(eventName, handler) {
				//　判断ob[eventName]是否是数组
				if(ob[eventName]) {
					ob[eventName].push(hanler);
				} else {
					ob[eventName] = [handler];
				}
			}, 
			// 触发事件
			trigger: function(eventName, handler) {
				if(ob[eventName]) {
					// 必定是数组
					// ob[eventName].forEach(function(value, index) {
					// 	value(handler);
					// })
					// 另一种写法
					for(var i = 0; i < ob[eventName].length; i++) {
						ob[eventName][i](handler);
					}
				} else {
					// 表示不存在
					console.log("该" + eventName + "事件不存在");
				}
			},
			// 取消事件
			off: function(eventName, handler) {
				if(ob[eventName]) {
					ob[eventName].forEach(function(value, index) {
						if(value === handler) {
							// 表示删除这一个
							ob[eventName].splice(index, 1);
						} else if(value === type) {
							// 删除整类
							ob[eventName] = []
						} else {
							// 表示删除全部
							ob = {}
						}
					})
				}
			},
			// 只触发一次
			once: function(eventName, handler) {
				// 思路： 监听， 触发， 执行完毕， 删除
				function aaa() {
					// 执行
					handler();
					// 删除
					Observer.off(eventName, aaa);
				}
				// 绑定新的函数
				Observer.on(eventName, aaa);
			}
		}
	})()	
})