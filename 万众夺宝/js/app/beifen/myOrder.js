var winId = "";
mui.plusReady(function() {
	console.log(plus.webview.currentWebview().id)
	var self = plus.webview.currentWebview();
	winId = self.winID;
	var userInfo = localStorage.getItem("$user") || "";
	//plus.nativeUI.toast(userInfo);
	getuser();
});

/*显示用户信息*/
function getuser() {
	var user = localStorage.getItem("$uesr");
	if (user) {
		user = JSON.parse(user);
		mui.post(Gobal.server_url + "/mobile/ajax/userxinxi/", {
			key: user.key,
			uid: user.uid
		}, function(data) {
			if (data.status == 1) {
				var html = template('user_Login', data);
				document.getElementById("user_xinxi").innerHTML = html;
				AUp();
			} else {
				AUp();
			}
		}, 'json');
	}
}
/*清空用户信息*/
function tuichu() {
	localStorage.clear();
	plus.webview.getWebviewById(winId).evalJS("user()");
	plus.webview.getWebviewById("my-order.html").close();

}

function AUp() {
	mui("#ulFun").off();
	mui("#ulFun").on("tap", "li", function() {
		var Address = this.getAttribute("id");
		var title = this.getAttribute("title");
		if (!title) {
			/*退出登录*/
			if (Address == "tuichu") {
				$.PageDialog.confirm("是否退出账户！", function() {
					tuichu();
				}, "")
			}
			/*修改头像*/
			if (Address == "HeadImage") {
				changeHeadImage();
			}
			return
		}
		if (Address) {
			mui.openWindow({
				url: "IndexHead.html",
				id: "set.html",
				extras: {
					Address: Address,
					wType: 'back',
					wName: title
				}
			});
		}
	});
}

function retrieve() {
	var user = localStorage.getItem("$uesr");
	if (user) {
		user = JSON.parse(user);
		mui.post(Gobal.server_url + "/mobile/ajax/userxinxi/", {
			key: user.key,
			uid: user.uid
		}, function(data) {
			if (data.status == 1) {
				$("#headImg").html('<img src="' + data.userxinxi.img + '" />');
				$("#username").html(data.userxinxi.username);
			} else {
				plus.nativeUI.toast("网络连接失败");
			}
		}, 'json');
	}
}