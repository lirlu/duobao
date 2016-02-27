mui.init({
	swipeBack           : false,//右滑关闭功能
	statusBarBackground : '#E10328',
	gestureConfig       : {
		doubletap  : true,
		popGesture :'none', //IOS下禁用右滑关闭
	},
});

mui.back = function() {
	//首次按键，提示‘再按一次退出应用’
	if (new Date().getTime() - app.esced < 1000) {
		plus.runtime.quit();
	} else {
		app.esced = new Date().getTime();
		mui.toast('再按一次退出应用');
	}
};


mui.plusReady(function(){
	app.preload('home.html', {
		'title': '万众夺宝', 
		'back' : false, 
		'more' : {
			'content' : '<img src="../image/icon-notice.png">公告', 
			'tap'     : 'app.error("点击公告")'
		}
	});
	app.preload('product.html', {'title':'所以商品', 'back':false});
	app.preload('cart.html', {'title':'购物车', 'back':false});
	app.preload('account.html', {'title':'个人中心', 'back':false});

	setTimeout(function () { plus.webview.show('home.html'); }, 10)
	
	mui('nav.bar-tab').on('tap', '.tab-item', function() {
		console.log(app.stored.length);
		$('nav.bar-tab .tab-item').removeClass("active");
		$(this).addClass("active");
		//app.load({'url' : 'html/' + this.getAttribute('data-url')});
		plus.webview.show(this.getAttribute('data-url'));
	});
});