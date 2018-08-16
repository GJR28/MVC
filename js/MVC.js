// 被暴露的对象 最顶层的MVC
var MVC = (function() {
	// M层
	var M = (function() {
		// 存储数据的对象
		var _M = {

		}

		// 返回一个接口 
		return {
			/*
			 * add方法 负责向_M中添加数据
			 * @path 要存储的层级路径  ex: a.b.c
			 * @value 要存储的值   ex: any
			 */
			add: function(path, value) {
				// 第一步  分隔层级路径
				var pathArr = path.split(".");
				// 第二步  保存_M
				var result = _M;
				// 第三步  循环每一层
				for(var i = 0; i < pathArr.length - 1; i++) {
					// 获取变量
					var temp = result[pathArr[i]];
					// 判定下一层是否 可以存储内容
					if(typeof temp === "object" && temp != null || typeof temp === "function") {
						// 指向下一层
						result = result[pathArr[i]];
					} else if(temp === undefined) {
						// 是undefined  说明 虽然不是引用类型但是 还没有被人使用过  我们就将它变成引用类型
						result[pathArr[i]] = {};
						// 指向下一层
						result = result[pathArr[i]];
					} else {
						// 说明 既不是引用类型 又不是undefined   被人使用过 
						throw new Error("不可以往值类型身上添加属性")
					}
				}
				// 当for循环执行完毕时， 指向了最后一层
				if(result[pathArr[i]] === undefined) {
					result[pathArr[i]] = value;
				} else {
					throw new Error("不可以占用别人的内容")
				}
			},
			/*
			 * get方法 用于从M层中提取数据
			 * @path 提取的数据所在路径
			 */
			get: function(path) {
				// 第一步  解析成数组
				var pathArr = path.split(".");
				// 第二步  备份_M
				var result = _M;
				// 第三步  循环
				for(var i = 0; i < pathArr.length - 1; i++) {
					// 判断 如果下一层是引用类型 那么就继续往下找 如果下一层不是引用类型 直接return
					if(typeof result[pathArr[i]] === "object" && result[pathArr[i]] != null || typeof result[pathArr[i]] === "function") {
						// 指向下一层
						result = result[pathArr[i]];
					} else {

						return null;
					}
				}
				// 如果循环完毕 说明到最后一层了
				return result[pathArr[i]]
			}
		}
	})();
	// V层
	var V = (function() {
		// 创建视图 是一个过程 需要许多句代码 如何存储代码？
		// 答：使用函数 
		// 而V层是可以存储创建视图的代码的。也就是要存储这些创建视图的函数
		// 定义_V
		var _V = {
			
		};
		// 向外提供接口
		return {
			/*
			 * add方法用于向V层中添加函数 为了方便存储 需要一个代号 
			 * @key 该函数要创建的视图的名称
			 * @fun 具体的创建代码函数
			 */
			add: function(key, fun) {
				_V[key] = fun;
			},
			/*
			 * create方法 用于执行函数
			 * @key 表示要执行哪个函数
			 */
			create: function(key) {
				return _V[key](M);
			}
		}
	})();
	// C层
	var C = (function() {
		// 添加交互 也是代码 也与V层类似
		var _C = {}


		// 返回接口
		return {
			/*
			 * add方法用于添加控制器  将控制器中的交互代码存储起来 不执行
			 * @key 被存储起来的控制器代号
			 * @fun 被存储起来的控制器本身
			 */
			add: function(key, fun) {
				_C[key] = fun;
			},

			/*
			 * init  执行方法 用于启动所有控制器
			 */
			init: function() {
				for(var i in _C) {
					_C[i](M, V);
				}
			}
		}
	})()

	return {
		/*
		 * addModel 用于添加模型
		 */
		addModel: function(path, value) {
			M.add(path, value)
		},
		addView: function(key, fun) {
			V.add(key, fun)
		},
		addCtrl: function(key, fun) {
			C.add(key, fun)
		},
		install: function() {
			C.init();
		}
	}
})()