var introduce = {
	activityId: '',
	openId: '',
	init:function() {},
	bindEvent:function() {},
	acquireActivity: function() {},
	acquireActivity_callback: function(responseData) {},
	fillInActivity: function() {},	
}
introduce.init = function() {
	introduce.bindEvent();
	introduce.fillInActivity();
}
introduce.bindEvent = function() {
	$("#homePage").on("click", function() {
		var url='vote.html?v='+new Date().getTime()+'&openid='+introduce.openId+'&state='+introduce.activityId;
		window.location.href = url;
	});
	$("#signUp").on("click", function() {
		var url='signUp.html?v='+new Date().getTime()+'&openid='+introduce.openId+'&state='+introduce.activityId;
		window.location.href = url;
	});
	$("#search").on("click", function() {
		var url='search.html?v='+new Date().getTime()+'&openid='+introduce.openId+'&state='+introduce.activityId;
		window.location.href = url;
	});
	$("#ranked").on("click", function() {
		var url='vote.html?v='+new Date().getTime()+'&isRanked=true&openid='+introduce.openId+'&state='+introduce.activityId;
		window.location.href = url;
	});
}
introduce.acquireActivity = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/activitymanagement/get', {
		id: introduce.activityId,
		openid: introduce.openId
	}, introduce.acquireActivity_callback);
}
introduce.acquireActivity_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try {
		response = JSON.parse(responseData);
	} catch(e) {
		response = responseData;
	}
	if(response.code == 200) {
		introduce.activityData = response.data;
//		vote.init();
		jsSDk.initWx(introduce.signatureData);
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}

}
introduce.fillInActivity = function(){
	$('#introduceInfo').html(introduce.activityData.activityexplain);
}
$(document).ready(function() {
	var urlParam = weapp.getParamByUrl();
	if(urlParam.openid) {
		//空表示非法访问
		introduce.openId = urlParam.openid;
	}
	if(urlParam.state) {
		introduce.activityId = urlParam.state;
		asyncData.jssignature();
		//				vote.init();
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
				introduce.signatureData = jsonData;
				introduce.acquireActivity();
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
			jsApiList: ['playVoice', 'stopVoice', 'onVoicePlayEnd', 'onMenuShareAppMessage', 'onMenuShareTimeline', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
					introduce.init();
				}
			});
			wx.onMenuShareAppMessage({
				title: introduce.activityData.activityname, // 分享标题
				desc: introduce.activityData.description, // 分享描述
				link: introduce.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url + '/activitymanagement/getattach?mongoid=' + introduce.activityData.messagepic, // 分享图标
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
				title: introduce.activityData.activityname, // 分享标题
				link: introduce.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url + '/activitymanagement/getattach?mongoid=' + introduce.activityData.messagepic, // 分享图标
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