var sharecontent = {};
sharecontent.value = "万众夺宝，惊喜不断";
var shareShow = {};
var urls = localStorage.getItem("url");
shareShow.value = urls;
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	winId = self.winID;
	var userInfo = localStorage.getItem("$user") || "";
	geterweima();
	$("#recommended").on('tap', function() {
		shareshow();
	});
	updateSerivces();
});

/*获取二维码*/
function geterweima() {
	var user = localStorage.getItem("$uesr");
	console.log(user)
	if (user) {
		user = JSON.parse(user);
		mui.post(Gobal.server_url + "/mobile/ajax/dimensional/", {
			key: user.key,
			uid: user.uid
		}, function(data) {
			if (data.status == 1) {
				console.log("获取二维码：" + JSON.stringify(data))
				localStorage.setItem("url", data.url);
				shareShow.value = data.url;
				$(".erweima").attr("src", data.erweima);
			} else {
				console.log("获取二维码失败：" + JSON.stringify(data))
			}
		}, 'json');

	}
}
/**
 * 更新分享服务
 */

function updateSerivces() {
	plus.share.getServices(function(s) {
		shares = {};
		for (var i in s) {
			var t = s[i];
			shares[t.id] = t;
		}
	}, function(e) {
		console.log("获取分享服务列表失败：" + e.message);
	});
}
/**
 * 调用系统分享
 * 调用
 */
function shareSystem() {
	if (plus.os.name !== "Android") {
		plus.nativeUI.alert("此平台暂不支持系统分享功能!");
		return;
	}
	var intent = new Intent(Intent.ACTION_SEND);
	var p = "";
	if (pic && pic.realUrl) {
		p = pic.realUrl;
		if (p.substr(0, 7) === "file://") {
			p = p.substr(7);
		} else if (p.sub(0) !== "/") {
			p = plus.io.convertLocalFileSystemURL(p);
		}
	}
	var f = new File(p);
	var uri = Uri.fromFile(f);
	if (f.exists() && f.isFile()) {
		console.log("image/*");
		intent.setType("image/*");
		intent.putExtra(Intent.EXTRA_STREAM, uri);
	} else {
		console.log("text/plain");
		intent.setType("text/plain");
	}
	intent.putExtra(Intent.EXTRA_SUBJECT, "HBuilder");
	intent.putExtra(Intent.EXTRA_TEXT, sharecontent.value);
	intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
	main.startActivity(Intent.createChooser(intent, "系统分享"));
}
/**
 * 分享操作
 * @param {String} id
 */
function shareAction(id, ex) {
	var s = null;
	console.log("分享操作：");
	if (!id || !(s = shares[id])) {
		//alert(id+"   "+shares[id])
		//alert("无效的分享服务");
		console.log("无效的分享服务！");
		return;
	}
	if (s.authenticated) {
		//alert("已授权");
		console.log("---已授权---");
		shareMessage(s, ex);
	} else {
		console.log("---未授权---");
		//alert("未授权");
		s.authorize(function() {
			shareMessage(s, ex);
		}, function(e) {
			//alert("认证授权失败：" + e.code + " - " + e.message);
			console.log("认证授权失败：" + e.code + " - " + e.message);
		});
	}
}
/**
 * 发送分享消息
 * @param {plus.share.ShareService} s
 */
function shareMessage(s, ex) {
	//alert(JSON.stringify(s));
	//alert(JSON.stringify(ex));
	//alert(JSON.stringify(sharecontent.value));
	//alert(JSON.stringify(bhref));
	var msg = {
		content: sharecontent.value,
		extra: {
			scene: ex
		}
	};
	if (bhref) {
		msg.href = shareShow.value;
		msg.title = "万众夺宝";
		msg.thumbs = ["_www/logo.png"];
		msg.pictures = ["_www/logo.png"];
	} else {
		if (pic && pic.realUrl) {
			msg.pictures = [pic.realUrl];
		}
	}
	console.log(JSON.stringify(msg));
	s.send(msg, function(res) {
		//alert(JSON.stringify("a"+res));
		console.log(JSON.stringify(msg));
	}, function(e) {
		//alert("b"+JSON.stringify(e));
	});
}
// 分析链接
function shareshow() {
	bhref = true;
	var ids = [{
			id: "weixin",
			ex: "WXSceneSession"
		}, {
			id: "weixin",
			ex: "WXSceneTimeline"
		}, {
			id: "qq"
		}, {
			id: "tencentweibo"
		}],
		bts = [{
			title: "发送给微信好友"
		}, {
			title: "分享到微信朋友圈"
		}, {
			title: "分享到QQ"
		}, {
			title: "分享到腾讯微博"
		}];
	plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: bts
		},
		function(e) {
			var i = e.index;
			if (i > 0) {
				shareAction(ids[i - 1].id, ids[i - 1].ex);
			}
		}
	);
}