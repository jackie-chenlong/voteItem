var signUp = {
	activityId: '',
	openId: '',
	status: 0,
	info: {},
	tagName: '',
	tagId: '',
	imageLength: 0,
	imageId: '',
	fileId: '',
	imageList: [],
	imageListId: [],
	pictures: [],
	oldData:'',
	animateTime:'',
	$play:'',
	init: function() {},
	bindEvent: function() {},//绑定的点击事件
	alertEvent: function() {},//弹窗
	getQueryString: function(name) {},
	acquireActivity: function() {},//获取活动信息
	acquireActivity_callback: function(responseData) {},
	acquireTagList: function() {},//获取类别列表
	acquireTagList_callback: function(responseData) {},
	downloadData: function() {},//获取按钮的状态
	downloadData_callback: function(responseData) {},
	acquireData: function() {},//获取注册信息
	submitData: function() {},//提交用户注册信息
	submitData_callback: function(responseData) {}
}
signUp.init = function() {
	signUp.bindEvent();
	signUp.alertEvent();
//	signUp.uploadImage();
	signUp.acquireTagList();
	$("#homePage").find('img').attr('src', '../images/homePage.png');
	$('#ranked').find('img').attr('src', '../images/rank.png');
	$('#search').find('img').attr('src', '../images/search.png');
	$('#signUp').find('img').attr('src', '../images/signUped.png');
	if(navigator.userAgent.indexOf('iPhone') > -1){
        $(".playBtn").css('position','relative');
        $(".playBtn").css('top','2px');
        $('body').css('margin-bottom','11%');
	}
}
signUp.alertEvent = function() {
	$.weui = {};
	$.weui.alert = function(options) {
		options = $.extend({
			title: '提示',
			text: '提示内容'
		}, options);
		var $alert = $('.weui_dialog_alert');
		$alert.find('.weui_dialog_title').text(options.title);
		$alert.find('.weui_dialog_bd').text(options.text);
		$(".weui_btn_dialog").on("click", function() {
			$alert.hide();
			//			event.cancelBubble = true;
		});
		$alert.show();
	};
}

signUp.bindEvent = function() {
	$('.weui_uploader_file').unbind('click').on('click', function() {
		//自动产生点击事件
		signUp.fileId = $(this).attr('id');
		//		$('#appendBtn').click();
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				signUp.imageLength++;
				$('.weui_cell_ft').text(signUp.imageLength + '/2');
				$('#' + signUp.fileId).hide();
//				$('#' + signUp.imageId).children().hide();
				var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
				$('#' + signUp.fileId).siblings('img').show();
				$('#' + signUp.fileId).siblings('img').attr('src',localIds);
				$('#' + signUp.fileId).siblings('.deleteBtn').show();
				wx.uploadImage({
					localId: localIds.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function(res) {
						var serverId = res.serverId; // 返回图片的服务器端ID
						if(signUp.fileId == 'file1') {
							signUp.imageListId[0] = {
								'mediaid': serverId,
								'seq' : 1
							};
						} else {
							signUp.imageListId[1] = {
								'mediaid': serverId,
								'seq' : 2
							};
						}
					}
				});
			}
		});
	});
	$(".deleteBtn").on("click", function() {
		signUp.imageLength--;
		$(this).hide();
		$(this).siblings('img').hide();
		$(this).siblings('.weui_uploader_file').show();
		$('.weui_cell_ft').text(signUp.imageLength + '/2');
	});
	$('#selectItem').on('click', 'input', function() {
		signUp.tagId = $(this).parent().attr("id");
		//要用prop设置，不能用attr
		$(this).parent().siblings().find('input').prop('checked', false);
	});
	$("#introduce").on("input", function() {
		var num = $("#introduce").val().length;
		$(".weui_textarea_counter span").text(num);
		if(num >= 300) {
			$.weui.alert({
				text: '最多只能写300个字'
			});
		}
	});
	$("#recordBtn").on("click", function() {
		if($(this).attr('isRecord') == 'true') {
			$(this).text('点击 录制');
			clearInterval(signUp.countTime);
			$('#recordNum').text('15"');
			$(this).attr('isRecord', false);
			wx.stopRecord({
				success: function(res) {
					signUp.recordId = res.localId;
				}
			});
		} else {
			$(this).text('点击 停止');
			$(this).attr('isRecord', true);
			wx.startRecord();
			var time = 15;
			signUp.countTime = setInterval(function() {
				time--;
				$('#recordNum').text(time + '"');
				if(time == 0) {
					clearInterval(signUp.countTime);
					wx.stopRecord({
						success: function(res) {
							signUp.recordId = res.localId;
							$('#recordNum').text('15"');
							$('#recordBtn').text('点击 录制');
							$('#recordBtn').attr('isRecord', false);
						}
					});
				}
			}, 1000);
		}
	});
	$('.playBtn').on("click", function() {
		signUp.$play = $(this);
		if($("#myAudio").attr('src') == undefined || signUp.recordId != undefined) {
//			if(signUp.recordId == undefined) {
//				reture;
//			}
			if($play.attr('isPlay') == 'true') {
				$play.attr('isPlay', false);
				wx.stopVoice({
					localId: signUp.recordId // 需要停止的音频的本地ID，由stopRecord接口获得
				});
//				$play.removeClass('shake');
				clearInterval(signUp.animateTime);		
			} else {
				$play.attr('isPlay', true);
				wx.playVoice({
					localId: signUp.recordId // 需要播放的音频的本地ID，由stopRecord接口获得
				});
//				$play.addClass('shake');
				signUp.animate(signUp.$play);
			    signUp.animateTime = setInterval('signUp.animate(signUp.$play)',1500);
				wx.onVoicePlayEnd({
					success: function(res) {
						var localId = res.localId; // 返回音频的本地ID
						$('.playBtn').attr('isPlay', false);
//						$play.removeClass('shake');
						clearInterval(signUp.animateTime);		
					}
				});
			}
		} else {
			var dom = document.getElementById("myAudio");
			if(dom.paused) {
				dom.play();
//				$play.addClass('shake');
				signUp.animate(signUp.$play);
			    signUp.animateTime = setInterval('signUp.animate(signUp.$play)',1500);
				$('#myAudio').unbind('ended').on('ended', function() {
			        clearInterval(signUp.animateTime);		
		        });
				return;
			}
			dom.pause();
			clearInterval(signUp.animateTime);		
			
		}
	});
	$("#submitBtn").on("click", function() {
		if(signUp.imageLength < 2) {
			$.weui.alert({
				text: '请按要求上传两张照片！'
			});
			return;
		} else if(signUp.tagId == '') {
			$.weui.alert({
				text: '请选择性格标签！'
			});
			return;
		} else if($("#introduce").val() == '') {
			$.weui.alert({
				text: '请填写参选宣言！'
			});
			return;
		} else if(signUp.recordId == undefined && signUp.oldData.voiceid == undefined) {
			$.weui.alert({
				text: '录音不能为空！'
			});
			return;
		} else if($("#name").val() == '') {
			$.weui.alert({
				text: '请填写姓名！'
			});
			return;
		} else if($("#phone").val() == '') {
			$.weui.alert({
				text: '请填写手机号码！'
			});
			return;
		}
		if(signUp.recordId != undefined){			
			wx.uploadVoice({
				localId: signUp.recordId, // 需要上传的音频的本地ID，由stopRecord接口获得
				isShowProgressTips: 1, // 默认为1，显示进度提示
				success: function(res) {
					var serverId = res.serverId; // 返回音频的服务器端ID
					signUp.info.voicemediaid = serverId;
					signUp.acquireData();
				}
			});
		}
		else{
			signUp.info.voiceid = signUp.oldData.voiceid;
			signUp.acquireData();
		}
	});
	$("#homePage").on("click", function() {
		var url = 'vote.html?v=' + new Date().getTime() + '&openid=' + signUp.openId + '&state=' + signUp.activityId;
		window.location.href = url;
	});
	$("#signUp").on("click", function() {
		var url = 'signUp.html?v=' + new Date().getTime() + '&openid=' + signUp.openId + '&state=' + signUp.activityId;
		window.location.href = url;
	});
	$("#search").on("click", function() {
		var url = 'search.html?v=' + new Date().getTime() + '&openid=' + signUp.openId + '&state=' + signUp.activityId;
		window.location.href = url;
	});
	$("#ranked").on("click", function() {
		var url = 'vote.html?v=' + new Date().getTime() + '&isRanked=true&openid=' + signUp.openId + '&state=' + signUp.activityId;
		window.location.href = url;
	});
}
signUp.animate = function(obj){
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
signUp.acquireActivity = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/activitymanagement/get', {
		id: signUp.activityId,
		openid: signUp.openId
	}, signUp.acquireActivity_callback);
}
signUp.acquireActivity_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		signUp.activityData = response.data;
		jsSDk.initWx(signUp.signatureData);
//				signUp.init();
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}

}
signUp.acquireTagList = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/activitymanagement/gettaglist', {
		openid: signUp.openId,
		activityid: signUp.activityId
	}, signUp.acquireTagList_callback);
}
signUp.acquireTagList_callback = function(responseData) {
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		//		$("#selectItem").append('<div class="selectItem_bd"><input type="checkbox" /><span>全部</span></div>');
		for(var i = 0; i < response.data.length; i++) {
			var html = '<div class="selectItem_bd" id="' + response.data[i].id + '"><input type="checkbox" /><span>' + response.data[i].tagname + '</span></div>';
			$("#selectItem").append(html);
		}
		signUp.downloadData();
	} else {
		$('#loadingToast').hide();
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
}
signUp.downloadData = function() {
	$.post(weapp.config.url + '/work/getmywork', {
		openid: signUp.openId,
		activityid: signUp.activityId
	}, signUp.downloadData_callback);
}
signUp.downloadData_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		signUp.status = response.data.status;
		$("#status_cell").show();
		if(signUp.status == 1 ){
			$("#status").text("已提交");
			$("#submitBtn").text('再次提交');
		}
		else if(signUp.status == 2){
			$("#status").text("已审核");
			$("#submitBtn").hide();
		}
		else if(signUp.status == 3){
			$("#status").text("已退回");
			$("#submitBtn").text('再次提交');
		}
		signUp.oldData = response.data;
		signUp.tagId = response.data.tagid;
		$("#" + signUp.tagId).find('input').prop('checked', true);
		$("#introduce").val(response.data.description);
		if(response.data.pictures[0]){
			$("#file1").hide();
			$("#image1").show();
			signUp.imageLength++;
			$("#image1").attr('src',  weapp.config.url + '/attach/getattach?mongoid=' +response.data.pictures[0].mongoid);
		}
        if(response.data.pictures[1]){
        	$("#file2").hide();
			$("#image2").show();
        	signUp.imageLength++;
			$("#image2").attr('src',  weapp.config.url + '/attach/getattach?mongoid=' +response.data.pictures[1].mongoid);		
		}
        $('.weui_cell_ft').text(signUp.imageLength + '/2');
        $('.deleteBtn').show();
		$("#myAudio").attr('src', weapp.config.url + '/voice/getvoice?voiceid=' + response.data.voiceid)
		$("#name").val(response.data.username);
		$("#phone").val(response.data.mobile);
	} 
	else if(response.code == 201){		
	}
	else{
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
}
signUp.acquireData = function() {
	$('#loadingToast').show();
	if(signUp.oldData != ''){
		signUp.info.id = signUp.oldData.id;
	}
	signUp.info.tagid = signUp.tagId;
	signUp.info.activityid = signUp.activityId;
	if(signUp.imageListId[0]){
		signUp.pictures[0] = signUp.imageListId[0];
	}
	else{
		signUp.pictures[0] =signUp.oldData.pictures[0];
	}
	if(signUp.imageListId[1]){
		signUp.pictures[1] = signUp.imageListId[1];
	}
	else{
		signUp.pictures[1] =signUp.oldData.pictures[1];
	}
	signUp.info.pictures = signUp.pictures;
	signUp.info.description = $("#introduce").val();
	signUp.info.username = $("#name").val();
	signUp.info.mobile = $("#phone").val();
	signUp.info.submitdate = Date.parse(new Date());
	signUp.info.weixinnickname = "";
	signUp.info.weixinprovince = "";
	signUp.info.weixincity = "";
	signUp.submitData();
}
signUp.saveImage = function() {
	$('#' + signUp.imageId).addClass('weui_uploader_status').append('<div class="weui_uploader_status_content">0%</div>');
	signUp.imageList[0] = $('#' + signUp.imageId).css("background-image").slice(27, -3);
	//	$.post('http://wxtest.marubi.cn/wxVote' + '/attach/addattach', {
	var data = {
		openid: signUp.openId,
		base64strlist: JSON.stringify(signUp.imageList)
	};
	$('#' + signUp.imageId + ' form[name="imgForm"]').ajaxSubmit({
		type: 'post',
		url: weapp.config.url + '/attach/addattach',
		data: data,
		success: signUp.saveImage_callback,
		error: function(XmlHttpRequest, textStatus, errorThrown) {
			$('#' + signUp.imageId).removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
			$.weui.alert({
				text: errorThrown
			});
			//				oastTip.toast("附件上传失败");
			//				spanBlock.innerHTML="附件上传失败";
			//				toastTip.toast(textStatus);				
		},
		uploadProgress: function(event, position, total, percentComplete) {
			if(percentComplete < 5)
				percentComplete = 5
			$('.weui_uploader_status_content').text(percentComplete - 5 + "%");
		},
		complete: function(xhr) {}
	});
}
signUp.saveImage_callback = function(responseData) {
	$('#' + signUp.imageId).removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();
	var response = JSON.parse(responseData);
	if(response.code == 200) {
		signUp.imageLength++;
		$('.weui_cell_ft').text(signUp.imageLength + '/2');
		if(signUp.imageId == 'image1') {
			signUp.imageListId[0] = response.data[0];
		} else {
			signUp.imageListId[1] = response.data[0];
		}
	}
	//	else {		
	//		$.weui.alert({
	//			text: response.msg
	//		});
	//	}
}
signUp.submitData = function() {
	$.post(weapp.config.url + '/work/saveorupdate', {
		openid: signUp.openId,
		workinfo: JSON.stringify(signUp.info),
	}, signUp.submitData_callback);
}
signUp.submitData_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try{
		response = JSON.parse(responseData);
	}
	catch(e) { 
		response = responseData;
	}
	if(response.code == 200) {
		//		for(var i = 0;i<$(".weui_uploader_file").length;i++){
		//			$(".weui_uploader_file").eq(i).find(".deleteBtn").remove();
		//		}
		$.weui.alert({
			text: "您的报名资料已成功提交，待审核通过后即可参加投票。"
		});
		$("#status_cell").show();
		$("#status").text("已提交");
		$("#submitBtn").text('再次提交');
	} else {
		$.weui.alert({
			text: response.msg
		});

	}
}

$(document).ready(function() {
	var urlParam = weapp.getParamByUrl();
	if(urlParam.openid) {
		//空表示非法访问
		signUp.openId = urlParam.openid;
	}
	if(urlParam.state) {
		signUp.activityId = urlParam.state;
		asyncData.jssignature();
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
				signUp.signatureData = jsonData;
				signUp.acquireActivity();
//				signUp.init();
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
			jsApiList: ['startRecord', 'stopRecord', 'uploadVoice', 'playVoice', 'stopVoice', 'onVoicePlayEnd', 'onMenuShareAppMessage','onMenuShareTimeline', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'hideMenuItems'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
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
					signUp.init();
				}
			});
			wx.onMenuShareAppMessage({
				title: signUp.activityData.activityname, // 分享标题
				desc: signUp.activityData.description, // 分享描述
				link: signUp.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url + '/activitymanagement/getattach?mongoid=' + signUp.activityData.messagepic, // 分享图标
				type: '', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function(dada) {
					var dada;
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			});
			wx.onMenuShareTimeline({
				title: signUp.activityData.activityname, // 分享标题
				link: signUp.activityData.activityURL, // 分享链接
				imgUrl:  weapp.config.url + '/activitymanagement/getattach?mongoid=' + signUp.activityData.messagepic, // 分享图标
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
