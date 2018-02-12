// searchbar
var searchbar = {
	activityId: '',
	openId: '',
	voteId: "",
	myScroll: "",
	pageIndex: 1,
	init: function() {},
	bindEvent: function() {},//绑定的点击事件
	scrollEvent: function() {},//滚动加载
	pageClickEvent: function() {},
	acquireActivity: function() {},//获取活动信息
	acquireActivity_callback: function(responseData) {},
	searchData: function() {},//查询请求
	searchData_callback: function(responseData) {},
	voteAdd: function() {},//投票请求
	voteAdd_callback: function(responseData) {}
}
searchbar.init = function() {
	searchbar.bindEvent();
	searchbar.scrollEvent();
	$("#homePage").find('img').attr('src', '../images/homePage.png');
	$('#ranked').find('img').attr('src', '../images/rank.png');
	$('#search').find('img').attr('src', '../images/searched.png');
	$('#signUp').find('img').attr('src', '../images/signUp.png');
}
searchbar.scrollEvent = function() {
	searchbar.myScroll = new IScroll('#wrapper', {
		mouseWheel: true,
		preventDefault: false
	});
	searchbar.myScroll.on('scrollEnd', function() {
		if($('#pullUp').attr('class') == 'scrollLoading')
			return;
		//防止页面无法弹回	
		if((this.y < this.maxScrollY) && (this.pointY < 1)) {
			this.scrollTo(0, this.maxScrollY, 400);
		}
		if(this.maxScrollY - this.y > -60) {
			$("#pullUp").show();
			$('#pullUp').addClass('scrollLoading');
			$('.pullUpIcon').addClass('scrollAnimate');
			$('#pullUp').find('.pullUpLabel').text('加载中...');
			searchbar.searchData();
		}
	});
	searchbar.myScroll.on('refresh', function() {
		$("#pullUp").hide();
		$('#pullUp').removeClass('scrollLoading');
		$('.pullUpIcon').removeClass('scrollAnimate');
		$('#pullUp').find('.pullUpLabel').text('上拉加载更多');
	});
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
}
searchbar.bindEvent = function() {
	document.getElementById("search_bar").onkeydown=function(e){
		if((e.keyCode || e.which) == 13){
			e.preventDefault();
            searchbar.pageIndex = 1;
			searchbar.searchData();
        }
	}
	$(".weui_icon_search").on("click", function() {
		searchbar.pageIndex = 1;
		searchbar.searchData();
	});
	$("#homePage").on("click", function() {
		var url = 'vote.html?v=' + new Date().getTime() + '&openid=' + searchbar.openId + '&state=' + searchbar.activityId;
		window.location.href = url;
	});
	$("#signUp").on("click", function() {
		var url = 'signUp.html?v=' + new Date().getTime() + '&openid=' + searchbar.openId + '&state=' + searchbar.activityId;
		window.location.href = url;
	});
	$("#search").on("click", function() {
		var url = 'search.html?v=' + new Date().getTime() + '&openid=' + searchbar.openId + '&state=' + searchbar.activityId;
		window.location.href = url;
	});
	$("#ranked").on("click", function() {
		var url = 'vote.html?v=' + new Date().getTime() + '&isRanked=true&openid=' + searchbar.openId + '&state=' + searchbar.activityId;
		window.location.href = url;
	});
	$('.bd').on('focus', '#search_input', function() {
		var $weuiSearchBar = $('#search_bar');
		$weuiSearchBar.addClass('weui_search_focusing');
	}).on('blur', '#search_input', function() {
		var $weuiSearchBar = $('#search_bar');
		$weuiSearchBar.removeClass('weui_search_focusing');
		if($(this).val()) {
			$('#search_text').hide();
		} else {
			$('#search_text').show();
		}
	}).on('input', '#search_input', function() {
		//		var $searchShow = $("#search_show");
		//		if($(this).val()) {
		////			$searchShow.show();
		//		} else {
		//			$searchShow.hide();
		//		}
	}).on('touchend', '#search_cancel', function() {
		//		$("#search_show").hide();
		$('#search_input').val('');
	}).on('touchend', '#search_clear', function() {
		//		$("#search_show").hide();
		$('#search_input').val('');
	});
	$("#works").on("click", '.works_item_images', function() {
		var paramUrl = 'openid=' + searchbar.openId + '&state=' + searchbar.activityId;
		window.location.href = "detailed.html?" + paramUrl + "&id=" + $(this).parent().attr("id");
	});
	$("#works").on("click", ".voteBtn", function() {
		searchbar.voteId = $(this).parents(".works_item").attr("id");
		//		if($(this).attr('isVoted') == 'false') {
		searchbar.voteAdd();
		//		}
	});
}
searchbar.acquireActivity = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/activitymanagement/get', {
		id: searchbar.activityId,
		openid: searchbar.openId
	}, searchbar.acquireActivity_callback);
}
searchbar.acquireActivity_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		searchbar.activityData = response.data;
		jsSDk.initWx(searchbar.signatureData);
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}

}
searchbar.searchData = function() {
	$('#loadingToast').show();
//	if(searchbar.pageIndex == 0){
//		$('#loadingToast').hide();
//		searchbar.myScroll.refresh();
//		return;
//	}
	$.post(weapp.config.url + '/work/findbyfilter', {
		openid: searchbar.openId,
		filter: $("#search_input").val(),
		activityid: searchbar.activityId,
		page: searchbar.pageIndex,
		size: 8
	}, searchbar.searchData_callback);
}
searchbar.searchData_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		if(searchbar.pageIndex == 1) {
			$("#works").html("");
		}
		for(var i = 0; i < response.data.list.length; i++) {
			var html = "<div class='works_item' id='" + response.data.list[i].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[i].num + "号</span><span class='works_item_userName'>" + response.data.list[i].username + "</span></div>" +
				"<div class='works_item_images'><img class='works_item_image' src='"+weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[0].mongoid+"' /><img class='works_item_image' src='"+weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[1].mongoid+"' /></diV>" +
				"<div class='works_item_vote'><div class='works_item_vote_left'>第<span>" + response.data.list[i].rank + "</span>名</div><div class='works_item_vote_middle'><span>" + response.data.list[i].numvote +
				"</span>票</div><div class='works_item_vote_right'><div class='voteBtn'><span>投票</span></div></div></div></div>";
			$("#works").append(html);
		}
		if(response.data.list[0]){
			searchbar.pageIndex = response.data.nextPage;
		}
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
    searchbar.myScroll.refresh();
}
searchbar.voteAdd = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/voteadd', {
		id: searchbar.voteId,
		openid: searchbar.openId
	}, searchbar.voteAdd_callback);
}
searchbar.voteAdd_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		//		$("#" + searchbar.voteId).find('.voteBtn').attr('isVoted', true);
		//		$("#" + searchbar.voteId).find('.voteBtn').addClass('voteBtned');
		$("#" + searchbar.voteId).find(".works_item_vote_middle span").text(parseInt($("#" + searchbar.voteId).find(".works_item_vote_middle span").text()) + 1);
		$("#dialog2").find('.weui_dialog_bd').text('投票成功');
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
}
$(document).ready(function() {
	var urlParam = weapp.getParamByUrl();
	if(urlParam.openid) {
		//空表示非法访问
		searchbar.openId = urlParam.openid;
	}
	if(urlParam.state) {
		searchbar.activityId = urlParam.state;
		asyncData.jssignature();
		//		signUp.init();
	}
});

var asyncData = {
	jssignature: function() {
		var url = weapp.config.url + '/jssignature',
			newParam = {
				url: window.location.href
			};
		weapp.getData('post', url, newParam, function(jsonData) {
			if(jsonData.code === 200) {
				searchbar.signatureData = jsonData;
				searchbar.acquireActivity();
			}
		});
	}
}

var jsSDk = {
	initWx: function(jsonData) {
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: jsonData.data.appid,
			timestamp: jsonData.data.timestamp,
			nonceStr: jsonData.data.noncestr,
			signature: jsonData.data.signature,
			jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline','chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		wx.ready(function() {
			//控制按钮
			wx.hideMenuItems({
				menuList: [
					'menuItem:share:qq',
					'menuItem:share:weiboApp',
					'menuItem:share:QZone',
					'menuItem:openWithQQBrowser',
					'menuItem:openWithSafari',
					'menuItem:copyUrl' // 复制链接
				],
				success: function(res) {
					searchbar.init();
				}
			});
			wx.onMenuShareAppMessage({
				title: searchbar.activityData.activityname, // 分享标题
				desc: searchbar.activityData.description, // 分享描述
				link: searchbar.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url + '/activitymanagement/getattach?mongoid=' + searchbar.activityData.messagepic, // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			});
			wx.onMenuShareTimeline({
				title: searchbar.activityData.activityname, // 分享标题
				link: searchbar.activityData.activityURL, // 分享链接
				imgUrl:  weapp.config.url + '/activitymanagement/getattach?mongoid=' + searchbar.activityData.messagepic, // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			});
		});
	}
}