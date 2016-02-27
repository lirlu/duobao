var app = window.app = window.lirlu = {};
app.esced = new Date();
app.stored = [];
app.link = {
	server_url    : 'http://miaogou.lirlu.com/?/',
	server_url_on : 'http://miaogou.lirlu.com',
	image_url     : 'http://miaogou.lirlu.com/statics/uploads',
	share         : 'http://miaogou.lirlu.com/wx/index.html'
}
// 检测网络连接是否正常
app.isNetwordReady = function () {
	return plus.networkinfo.getCurrentType() == 1;
};
/**
 * 显示3.5秒的toast错误提示信息
 * @param {String} 提示字符串
 */
app.error = function (text) {
	plus.nativeUI.toast(text, {'duration':'long'});
};
/**
 * 获取当前地址
 * @param {Function} 回调方法，如果获取失败会返回一个默认的地址
 * @return {Object} 地址信息。JSON对象 
 */
app.locate = function (cb) {
	console.log(cb);
	var view = plus.webview.currentWebview();
	plus.geolocation.getCurrentPosition(
		function (res) {
			localStorage.setItem("$LocationAddress", JSON.stringify(res));
			if (cb) cb(res);
		}, 
		function () {
			plus.nativeUI.toast('定位失败,请检查手机定位是否开启！');
			if (cb) cb({'address':{'city':'北京市'}});
		}, 
		{ provider : 'baidu' }
	);
}
app.exists = function () {
	
};
/**
 * 取得ArtTemplate并填充数据再把数据放于直接dom下。已做try catch处理
 * @param {Object} 用于放置构造出来的tpl代码的容器，可是jquery对象也可以是jquery的选择表达式
 * @return {String} 模板ID
 * @return {Object} 数据
 */
app.tpl = function (dom, tpl, data) {
	try { $(dom).html(template(tpl, data)); } catch (e) {};
};
app.api = function (link) {
	return app.link.server_url + link;
}
app.preload = function (link, data) {
	data = data || {};
	app.stored.push(link);
	// 作用域是公用的
	return mui.preload({
		url    : 'html/shared.html',
		id     : data.id || link,
		styles : {top:'0px', bottom:'45px'},
		extras : {extras:mui.extend({_FROM_:plus.webview.currentWebview().id, url:link}, data)},
	});
};
app.load = function (link, data) {
	var view = plus.webview.currentWebview();
	var sub = plus.webview.create(link, data.id || link, {bottom:'45px',top:'45px'}, data);
	view.append(sub);
	
	setTimeout(function() { plus.nativeUI.closeWaiting(); }, 200);
};
app.open = function (link, data) {
	data = data || {};
	app.stored.push(link);
	
	mui.openWindow({
	    url       : '../html/shared.html',
	    id        : data.id || link,
	    extras    : {extras:mui.extend({_FROM_:plus.webview.currentWebview().id, url:link}, data)},
	    createNew : false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显示
	    waiting   : {
	    	autoShow : true,//自动显示等待框，默认为true
	    	title    : '正在加载...',//等待对话框上显示的提示内容
	    }
	})
};




