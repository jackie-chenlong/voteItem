var detailedInfo = {
	activityId: '',
	openId: '',
	id: "",
	animateTime:'',
	$play:'',
	init: function() {},
	bindEvent: function() {},
	acquireActivity: function() {},
	acquireActivity_callback: function(responseData) {},
	acquireWorkInfo: function() {},
	acquireWorkInfo_callback: function(responseData) {},
	getQueryString: function(name) {},
	voteAdd: function() {},
	voteAdd_callback: function(responseData) {}

}
detailedInfo.init = function() {
	detailedInfo.bindEvent();
	detailedInfo.acquireWorkInfo();
}
detailedInfo.bindEvent = function() {
	$("#homePage").on("click", function() {
		var url='vote.html?v='+new Date().getTime()+'&openid='+detailedInfo.openId+'&state='+detailedInfo.activityId;
		window.location.href = url;
	});
	$("#signUp").on("click", function() {
		var url='signUp.html?v='+new Date().getTime()+'&openid='+detailedInfo.openId+'&state='+detailedInfo.activityId;
		window.location.href = url;
	});
	$("#search").on("click", function() {
		var url='search.html?v='+new Date().getTime()+'&openid='+detailedInfo.openId+'&state='+detailedInfo.activityId;
		window.location.href = url;
	});
	$("#ranked").on("click", function() {
		var url='vote.html?v='+new Date().getTime()+'&isRanked=true&openid='+detailedInfo.openId+'&state='+detailedInfo.activityId;
		window.location.href = url;
	});
	$("#transcribe").on('click',function(){
		detailedInfo.$play = $(this);
        var dom = document.getElementById("myAudio");
		if(dom.paused) {
			dom.play();
//			$("#transcribe").addClass('shake');
 			detailedInfo.animate(detailedInfo.$play);
			detailedInfo.animateTime = setInterval('detailedInfo.animate(detailedInfo.$play)',1500);
			$('#myAudio').unbind('ended').on('ended', function() {
//			    $("#transcribe").removeClass('shake');
				clearInterval(detailedInfo.animateTime);
		    });
			return;
		}
		dom.pause();
//		$("#transcribe").removeClass('shake');
        clearInterval(detailedInfo.animateTime);
	});
	$(".works_item_btn").on("click", function() {
//		if($(this).attr('isVoted') == 'false') {
			detailedInfo.voteAdd();
//		}
	});
}
detailedInfo.animate = function(obj){
//	vote.animateTime = setInterval(function(){
		obj.children('img').attr('src','../images/voice1.png');
		setTimeout(function(){
			obj.children('img').attr('src','../images/voice2.png');
		},500);
		setTimeout(function(){
			obj.children('img').attr('src','../images/voice3.png');
		},1000);
		
//	},500);
}
detailedInfo.acquireActivity = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/activitymanagement/get', {
		id: detailedInfo.activityId,
		openid: detailedInfo.openId
	}, detailedInfo.acquireActivity_callback);
}
detailedInfo.acquireActivity_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		detailedInfo.activityData = response.data;
		jsSDk.initWx(detailedInfo.signatureData);
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}

}
detailedInfo.acquireWorkInfo = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/get', {
		openid: detailedInfo.openId,
		id: detailedInfo.id
	}, detailedInfo.acquireWorkInfo_callback);
}
detailedInfo.acquireWorkInfo_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		$("#personNum span").text(response.data.num);
		$("#personName").text(response.data.username);
		$("#imageInfo span").text(response.data.description);
		$("#voteInfo_left span").text(response.data.rank);
		//		$("#workImage1").css("background-image","url("+response.data.picthumbnails+")");
		$(".works_item_changeNum").text(response.data.numvote);
		for(var i = 1; i <= response.data.pictures.length; i++) {
			$("#workImage" + i).attr("src", weapp.config.url+'/attach/getattach?mongoid='+response.data.pictures[i - 1].mongoid);
		}
		$("#myAudio").attr('src',weapp.config.url + '/voice/getvoice?voiceid=' +response.data.voiceid);
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
}
detailedInfo.getQueryString = function(name) {
	var reg = new RegExp("^" + name + "=([^&]*)$", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[1]);
	return null; //unescape解码
}
detailedInfo.voteAdd = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/voteadd', {
		id: detailedInfo.id,
		openid: detailedInfo.openId
	}, detailedInfo.voteAdd_callback);
}
detailedInfo.voteAdd_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
//		$('.works_item_btn').attr('isVoted', true);
//		$('.works_item_btn').addClass('voteBtned');
		$(".works_item_changeNum").text(parseInt($(".works_item_changeNum").text()) + 1);
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
		detailedInfo.openId = urlParam.openid;
	}
	if(urlParam.id){
		detailedInfo.id = urlParam.id;
	}
	if(urlParam.state) {
		detailedInfo.activityId = urlParam.state;
		asyncData.jssignature();
//		detailedInfo.init();
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
				detailedInfo.signatureData = jsonData;
				detailedInfo.acquireActivity();
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
			jsApiList: ['playVoice', 'stopVoice','onVoicePlayEnd', 'onMenuShareAppMessage','onMenuShareTimeline', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
					detailedInfo.init();
				}
			});
			wx.onMenuShareAppMessage({
				title: detailedInfo.activityData.activityname, // 分享标题
				desc: detailedInfo.activityData.description, // 分享描述
				link: detailedInfo.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url+'/activitymanagement/getattach?mongoid='+detailedInfo.activityData.messagepic, // 分享图标
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
				title: detailedInfo.activityData.activityname, // 分享标题
				link: detailedInfo.activityData.activityURL, // 分享链接
				imgUrl:  weapp.config.url + '/activitymanagement/getattach?mongoid=' + detailedInfo.activityData.messagepic, // 分享图标
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