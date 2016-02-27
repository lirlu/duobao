(function () {
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
		console.log(res.slides.listItems.length);
		$('#slider').html(template('tpl-slider', res.slides));
		
		mui('.mui-slider').slider({
			interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
		});
	})
	;
})();
