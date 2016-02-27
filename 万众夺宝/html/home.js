function home () {
	$.ajax({
		'url'  : app.api('mobile/ajax/index'),
		'type' : 'POST',
		'data' : {}
	})
	.fail(function (res) {
		app.error('接口错误：' + JSON.stringify(res));
	})
	.done(function (res) {
		var res = JSON.parse(res);
		console.log(window.app);
		app.tpl('#slider', 'tpl-slider', res.slides);// 轮播图片
		app.tpl('#lastest>.box', 'tpl-lastest', {'data':res.listItems});// 最新揭晓
		app.tpl('#hot>.box', 'tpl-hot', {'data':res.shoplistrenqi});// 热门推荐
		
		mui('.mui-slider').slider({
			interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
		});
	})
	;
}
function funcPullDownRefresh () {
	mui('#divRefreshContainer').pullRefresh().endPulldownToRefresh();
}
mui.init({
	pullRefresh : {
		container : '#divRefreshContainer',
		down      : {
			//contentdown    : '下拉可以刷新',
			//contentover    : '释放立即刷新',
			//contentrefresh : '正在刷新...',
			callback       : funcPullDownRefresh
		},
	}
});
mui.plusReady(function () { home(); });