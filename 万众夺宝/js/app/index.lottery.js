mui.plusReady(function() {
	//var scroller = document.getElementById("divLottery1").children[0];
	mui.init({
		pullRefresh: {
			container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			down: {
				contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
				contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
				contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
				callback: function() {
						if (plus.networkinfo.getCurrentType() == 1) {
							plus.nativeUI.toast("没有连接到网络，请检查网络连接");
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						} else {
							ZxjxList(function() {
								mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
							});
						}

					} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			}
		}
	});
	ZxjxList();
});

function ZxjxList(endFn) {
	mui.getJSON(Gobal.server_url + "/mobile/ajax/laterylist", function(res) {
		//localStorage.setItem("Zxjx", JSON.stringify(res)); //存储当前数据
		//if (res.status == 1) {
			ZList(res);
		//}
		console.log(JSON.stringify(res));
		//解析数据
		// callback
		if (endFn)
			endFn();
	});
}

function ZList(res) {
	// 最新揭晓加载
	/*var data = {
		res: res
	}*/
	var html = template('lotter-zuixin', res);
	document.getElementById('divLottery2').innerHTML = html;
	Gobal.skipUserHome();
	mui("#divLottery2").on("tap", "ul", function() {
		var id = this.getAttribute("id");
		var qishu = "";
		if (id) {
			mui.openWindow({
				url: "IndexHead.html",
				id: "index.item" + id,
				extras: {
					Address: "index.item.html",
					wType: 'back',
					wName: "商品详情",
					ShopId: id,
					qishu: qishu
				}
			});
		}
	});
	//console.log(html)
}
//转换时间格式
template.helper('dateFormat', function(data, format) {
	var d = new Date(parseInt(data) * 1000);
	var s = '';
	s += d.getFullYear() + '-';
	s += (d.getMonth() + 1) + '-';
	s += d.getDate() + ' ';
	s += d.getHours() + ':';
	s += d.getMinutes();
	return s;
});