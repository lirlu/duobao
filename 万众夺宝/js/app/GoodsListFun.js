$(function() {
	var a = $("#divGoodsNav");
	var b = $("#divGoodsLoading");
	var g = $("#btnLoadMore");
	var c = null;
	var d = 10;
	var f = 0;
	var e = {
		sortID: 0,
		brandID: 0,
		orderFlag: 10,
		FIdx: 1,
		EIdx: d,
		isCount: 1
	};
	var i = false;
	var h = function() {
		var l = function(q) {
			if (q && q.stopPropagation) {
				q.stopPropagation()
			} else {
				window.event.cancelBubble = true
			}
		};
		var j = false;
		var k = false;
		a.children("li").each(function() {
			var r = $(this);
			var q = r.attr("order");
			if (q != "") {
				r.click(function() {
					r.addClass("current").siblings().removeClass("current");
					q = r.attr("order");
					e.orderFlag = q;
					if (e.orderFlag == 31) {
						r.attr("order", "30").html('<a href="javascript:;">价格<em class="orange"></em><s></s><b></b></a>')
					} else {
						if (e.orderFlag == 30) {
							r.attr("order", "31").html('<a href="javascript:;">价格<em></em><s class="orange"></s><b></b></a>')
						} else {
							r.siblings('li[type="price"]').attr("order", "31").html('<a href="javascript:;">价格<em></em><s></s><b></b></a>')
						}
					}
					c.getInitPage()
				})
			} else {
				r.click(function(s) {
					l(s);
					if (j) {
						r.removeClass("gSort").children("dl").css("display", "none");
						j = false
					} else {
						j = true;
						r.addClass("gSort").children("dl").show();
						if (!k) {
							r.children("dl").children("dd").each(function() {
								var t = $(this);
								t.click(function(u) {
									l(u);
									e.sortID = t.attr("type");
									t.addClass("sOrange").siblings().removeClass("sOrange");
									t.parent().hide().parent().removeClass("gSort");
									j = false;
									r.children("a").html(t.text() + '<s class="arrowUp"></s>');
									c.getInitPage()
								})
							});
							k = true
						}
					}
				})
			}
		});
		$("#loadingPicBlock").click(function() {
			a.children("li").last().removeClass("gSort").children("dl").css("display", "none");
			j = false
		});
		var m = function(q) {
			$.PageDialog.fail(q)
		};
		var p = function(q) {
			$.PageDialog.ok("<s></s>" + q)
		};
		var o = function(r, q) {
			GetJPData("http://m.1yyg.com", "addShopCart", "codeid=" + r + "&shopNum=" + q, function(s) {
				if (s.code == 0) {
					addNumToCartFun(s.num);
					p("添加成功")
				} else {
					if (s.code == 1) {
						m("本期已满员")
					}
				}
			})
		};
		$("div.goodsList").find("div.pRate").each(function() {
			var q = $(this);
			q.children("a.add").each(function() {
				$(this).click(function(r) {
					l(r);
					o($(this).attr("codeid"), 1)
				})
			})
		});
		var n = function() {
			var q = function() {
				return "sortID=" + e.sortID + "&brandID=" + e.brandID + "&orderFlag=" + e.orderFlag + "&FIdx=" + e.FIdx + "&EIdx=" + e.EIdx + "&isCount=" + e.isCount
			};
			var r = function() {
				b.show();
				GetJPData("http://m.1yyg.com", "getGoodsPageList", q(), function(u) {
					if (u.code == 0) {
						var t = u.listItems;
						if (e.isCount == 1) {
							f = u.count;
							e.isCount = 0
						}
						var x = t.length;
						var y = 0;
						var A = 0;
						var s = 0;
						var B = 0;
						for (var v = 0; v < x; v++) {
							var w = '<ul id="' + t[v].goodsID + '"><li><span class="z-Limg"><img src="' + Gobal.LoadPic + '" src2="http://mimg.1yyg.com/GoodsPic/pic-200-200/' + t[v].goodsPic + '">';
							if (t[v].codeType == 1) {
								w += '<div class="pTitle pLimitedTime">限时</div>'
							} else {
								switch (t[v].goodsTag) {
									case 1:
										w += '<div class="pTitle pNewProducts">新品</div>';
										break;
									case 2:
										w += "";
										break;
									case 3:
										w += '<div class="pTitle pPopularity">人气</div>';
										break
								}
							}
							w += '</span><div class="goodsListR"><h2>(第' + t[v].codePeriod + "期)" + t[v].goodsSName + "</h2>";
							y = parseInt(t[v].codeSales);
							A = parseInt(t[v].codeQuantity);
							s = parseInt(A - y);
							B = parseInt(y * 100) / A;
							B = y > 0 && B < 1 ? 1 : B;
							w += '<div class="pRate"><div class="Progress-bar"><p class="u-progress">' + (y > 0 ? '<span style="width:' + B + '%;" class="pgbar"><span class="pging"></span></span>' : "") + '</p><ul class="Pro-bar-li"><li class="P-bar01"><em>' + y + '</em>已参与</li><li class="P-bar02"><em>' + A + '</em>总需人次</li><li class="P-bar03"><em>' + s + '</em>剩余</li></ul></div><a href="javascript:;" codeid="' + t[v].codeID + '" class="add ' + (s == 0 ? "gray" : "") + '"><s></s></a></div></div></li></ul>';
							var z = $(w);
							z.click(function() {
								location.href = "/products/" + $(this).attr("id") + ".html"
							}).find("div.pRate > a").each(function() {
								var C = $(this);
								C.click(function(D) {
									l(D);
									if (!C.hasClass("gray")) {
										o(C.attr("codeid"), 1)
									}
								})
							});
							b.before(z)
						}
						if (e.EIdx < f) {
							i = false;
							g.show()
						}
						loadImgFun(0)
					} else {
						if (e.FIdx == 1) {
							b.before(Gobal.NoneHtml)
						}
					}
					b.hide()
				})
			};
			this.getInitPage = function() {
				e.FIdx = 1;
				e.EIdx = d;
				e.isCount = 1;
				f = 0;
				b.prevAll().remove();
				g.hide();
				r()
			};
			this.getFirstPage = function() {
				r()
			};
			this.getNextPage = function() {
				e.FIdx += d;
				e.EIdx += d;
				r()
			}
		};
		g.click(function() {
			if (!i) {
				i = true;
				g.hide();
				c.getNextPage()
			}
		});
		c = new n();
		c.getFirstPage()
	};
	Base.getScript(Gobal.Skin + "/JS/pageDialog.js?v=130826", h)
});