var winId = "";
mui.plusReady(function() {
	var qian = /^[0-9]*$  /;
	console.log(plus.webview.currentWebview().id)
	var self = plus.webview.currentWebview();
	winId = self.winID;
	var userInfo = localStorage.getItem("$uesr");
	money = localStorage.getItem("money");
	$("#money").html(money);
	//plus.nativeUI.toast(userInfo);
	navClass();
	//点击确认充值按钮，调用充值接口。判断是否充值成功
	$("#btnSubmit").on('tap', function() {
		var jine = Number($("#mm").html());
		if (jine != 0) {
			topUp(jine);
		} else {
			plus.nativeUI.toast("充值金额不能为0");
		}

	})


});

//选取分类选择
function navClass() {
	$("#ulOption li").on('click', 'a', function() {
		$("#ulOption li b").removeClass("z-initsel");
		$(this).addClass('z-sel');
		$(this).parent().siblings().children().removeClass('z-sel');
		var mon = $(this).parent().attr('money');
		var moneys = parseFloat(mon).toFixed(2);
		$("#mm").text(moneys);
	});

	$("#ulOption li").on('click', 'b', function() {
		$("#ulOption li a").removeClass("z-sel");
		$(this).addClass('z-initsel');
		var mon = $(this).children("input").val();
		if (mon != "") {
			var moneys = parseFloat(mon).toFixed(2);
			$("#mm").text(moneys);
		} else {
			var moneys = 0;
			$("#mm").text(moneys.toFixed(2));
		}
		$(this).children("input").keyup(function() {
			mon = $(this).val();
			if (isNaN(mon)) {
				$(this).val("");
				return false;
			}
			$("#mm").text(Number(mon).toFixed(2));
		});
	});
}


/*充值接口调用*/
function topUp(num) {
	var user = localStorage.getItem("$uesr");
	if (user) {
		user = JSON.parse(user);
		console.log(user.key);
		console.log(user.uid);
		$.ajax({
			type: "post",
			url: Gobal.server_url + "/?/mobile/ajax/userchongzhi",
			data: {
				uid: user.uid,
				key: user.key,
				money: num
			},
			async: true,
			timeout: 10000,
			dataType: "json",
			success: function(res) {
				console.log(res)
				var mhtOrderNo = res.substring(res.indexOf("mhtOrderNo"), res.length);
				mhtOrderNo = mhtOrderNo.substring(mhtOrderNo.indexOf("=") + 1, mhtOrderNo.indexOf("&"));
				plus.ipaynow.request("20151223", res.trim(), function(msg) {
					var data = msg.substring(1, msg.length - 1).split(",");
					var info = data[0].replace("msg:", "");
					var code = data[1].replace("code:", "");
					//plus.nativeUI.toast(info + " " + code);
					if (code == "00") {
						console.log(Gobal.server_url + "/?/mobile/ajax/after_do" + "   " + mhtOrderNo);
						$.ajax({
							type: "post",
							url: Gobal.server_url + "/?/mobile/ajax/after_do",
							data: {
								dingdan: mhtOrderNo
							},
							async: true,
							timeout: 10000,
							dataType: "json",
							success: function(res) {
								console.log(JSON.stringify(res));
								if (res.status != 0) {
									playSuccess();
								} else {
									plus.nativeUI.toast("充值未失败");
								}
							},
							error: function(res) {
								console.log(JSON.stringify(res));
								plus.nativeUI.toast("充值未成功")
							}
						});

					} else {
						plus.nativeUI.toast(info);
					}
				});
			},
			error: function(res) {
				console.log(JSON.stringify(res));
				plus.nativeUI.toast("充值未成功")
			}
		});
	}
}

function playSuccess() {
	plus.nativeUI.toast("恭喜充值成功!");
	var win = plus.webview.currentWebview();
	var userIndex = plus.webview.getWebviewById("indexuser.html");
	var userSet = plus.webview.getWebviewById("indexmy-order.html");
	var MyOrder = plus.webview.getWebviewById("indexMyOrder.html");
	if (win.callBack) {
		plus.webview.getWebviewById("indexcart.payment.html").evalJS("refreshWeb()");
		//alert("购物车充值");
	} else {
		if (userSet) {
			userSet.evalJS("getuser()");
			//alert("个人设置充值");
		}
		if (MyOrder) {
			MyOrder.evalJS("getuser()");
			//alert("我的订单充值");
		}
	}
	if (userIndex) {
		userIndex.evalJS("refreshWeb()");
		//alert("刷新个人中心");
	}
	//alert(win.windowID)
	plus.webview.getWebviewById(win.windowID).close();
}