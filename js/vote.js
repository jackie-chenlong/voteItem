var vote = {
	activityId: '',
	openId: '',
	itemId: [],
	voteId: "",
	tagId: "",
	pageIndex: 1,
	isRanked: false,
	isWholeTag: true,
	ms: 1000, //设置毫秒倒计时
	myScroll: "",
	endDate: "",
	animateTime: "",
	$play:"",
	activityData: {},
	init: function() {},
	scrollEvent: function() {},//滚动加载事件
	bindEvent: function() {},//绑定的点击事件
	countTime: function() {},
	acquireActivity: function() {},//获取活动信息
	acquireActivity_callback: function(responseData) {},//ajax获取活动信息的回调函数
	fillInActivity: function() {},
	acquireWorkList: function() {},//获取用户信息列表
	acquireWorkList_callback: function(responseData) {},//ajax获取用户信息列表的回调函数
	acquireRankedWorks: function() {},//获取排序的用户信息列表
	acquireRankedWorks_callback: function(responseData) {},//ajax获取排序的用户信息列表的回调函数
	acquireTagWorkList: function() {},//获取某一类别的用户信息列表
	acquireTagWorkList_callback: function(responseData) {},//ajax获取某一类别的用户信息列表的回调函数
	acquireRankedTagWorkList: function() {},
	acquireRankedTagWorkList_callback: function(responseData) {},
	voteAdd: function() {},//投票请求
	voteAdd_callback: function(responseData) {},
}

Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month 
		"d+": this.getDate(), //day 
		"h+": this.getHours(), //hour 
		"m+": this.getMinutes(), //minute 
		"s+": this.getSeconds(), //second 
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
		"S": this.getMilliseconds() //millisecond 
	}

	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
vote.init = function() {
	//	document.getElementById('myAudio').play();
	vote.fillInActivity();
	if(weapp.getParamByUrl().isRanked) {
		vote.isRanked = true;
		vote.acquireRankedWorks();
		$("#homePage").find('img').attr('src', '../images/homePage.png');
		$('#ranked').find('img').attr('src', '../images/ranked.png');
		$('#search').find('img').attr('src', '../images/search.png');
		$('#signUp').find('img').attr('src', '../images/signUp.png');
	} else {
		vote.isRanked = false;
		$("#homePage").find('img').attr('src', '../images/homePaged.png');
		$('#ranked').find('img').attr('src', '../images/rank.png');
		$('#search').find('img').attr('src', '../images/search.png');
		$('#signUp').find('img').attr('src', '../images/signUp.png');
		vote.acquireWorkList();
	}
	vote.bindEvent();
	vote.scrollEvent();
}
vote.scrollEvent = function() {
	vote.myScroll = new IScroll('#wrapper', {
		mouseWheel: true,
		preventDefault: false
	});
	vote.myScroll.on('scrollEnd', function() {
		if($('#pullUp').attr('class') == 'scrollLoading')
			return;
		//防止页面无法弹回	
		if((this.y < this.maxScrollY) && (this.pointY < 1)) {
			this.scrollTo(0, this.maxScrollY, 400);
		}
		//		var el = document.activeElement;
		//  if (el.nodeName.toLowerCase() == 'input') {
		//   return;
		// }
		//window.event.target.id == "pullUp"
		//		-this.y > (this.scrollerHeight - document.body.clientHeight - 1)
		if(this.maxScrollY - this.y > -60) { //this.wrapperHeight-this.y>(this.scrollerHeight-5)
			$("#pullUp").show();
			$('#pullUp').addClass('scrollLoading');
			$('.pullUpIcon').addClass('scrollAnimate');
			$('#pullUp').find('.pullUpLabel').text('加载中...');

			if(vote.isWholeTag) {
				if(vote.isRanked == false) {
					vote.acquireWorkList();
				} else {
					vote.acquireRankedWorks();
				}
			} else {
				if(vote.isRanked == false) {
					vote.acquireTagWorkList();
				} else {
					vote.acquireRankedTagWorkList();
				}
			}
		}

	});
	vote.myScroll.on('refresh', function() {
		$("#pullUp").hide();
		$('#pullUp').removeClass('scrollLoading');
		$('.pullUpIcon').removeClass('scrollAnimate');
		$('#pullUp').find('.pullUpLabel').text('上拉加载更多');
	});
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
	}, false);
}
vote.bindEvent = function() {
	$("#pullDownImg").on("click", function() {
		if($(this).attr('isclick') == 'false') {
			$(".pullDownMenu").show();
			$(this).attr('isclick', 'true');
		} else {
			$(".pullDownMenu").hide();
			$(this).attr('isclick', 'false');
		}
	});
	$(".pullDownMenu").on("click", function() {
		$(this).addClass('active');
        window.location.href = 'introduce.html?v=' + new Date().getTime() + '&openid=' + vote.openId + '&state=' + vote.activityId;
	});
	$("#ranked").on("click", function() {
		vote.pageIndex = 1;
		vote.isRanked = true;
		$("#homePage").find('img').attr('src', '../images/homePage.png');
		$('#ranked').find('img').attr('src', '../images/ranked.png');
		vote.acquireRankedWorks();
	});
	$("#homePage").on("click", function() {
		window.location.href = 'vote.html?v=' + new Date().getTime() + '&openid=' + vote.openId + '&state=' + vote.activityId;
	});
	$("#signUp").on("click", function() {
		window.location.href = 'signUp.html?v=' + new Date().getTime() + '&openid=' + vote.openId + '&state=' + vote.activityId;
	});
	$("#search").on("click", function() {
		window.location.href = 'search.html?v=' + new Date().getTime() + '&openid=' + vote.openId + '&state=' + vote.activityId;
	});
	$("#selectItem").on("click", '.selectItem_bd', function() {
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		//			vote.isRanked = false;
		if($(this).attr('id') == '') {
			vote.isWholeTag = true;
			vote.pageIndex = 1;
			if(vote.isRanked == false) {
				vote.acquireWorkList();
			} else {
				vote.acquireRankedWorks();
			}
		} else {
			vote.isWholeTag = false;
			vote.pageIndex = 1;
			vote.tagId = $(this).attr('id');
			if(vote.isRanked == false) {
				vote.acquireTagWorkList();
			} else {
				vote.acquireRankedTagWorkList();
			}
		}
	});
	$("#works").on("click", '.voteBtn', function() {
		if(vote.openId == '') {
			weapp.errorToast("请在微信上进行投票");
			return false;
		}
		//		if($(this).attr('isVoted') == 'false') {
		if($(this).parents('.works_item')[0]) {
			vote.voteId = $(this).parents('.works_item').attr("id");
			vote.voteAdd();
		} else {
			vote.voteId = $(this).parents('.works_firstItem').attr("id");
			vote.voteAdd();
		}
		//		}
	});
	$("#works").on('click', '.playBtn,.firstPlayBtn', function() {
		var dom = document.getElementById($(this).siblings('audio').attr('id'));
		vote.$play = $(this);
		var $dom = $('#'+$(this).siblings('audio').attr('id'));
		if(dom.paused) {
			for(var i = 0; i < document.getElementsByTagName('audio').length; i++){
				document.getElementsByTagName('audio')[i].pause();
				clearInterval(vote.animateTime);
			}
			dom.play();
//			$play.addClass('shake');
			vote.animate(vote.$play);
			vote.animateTime = setInterval('vote.animate(vote.$play)',1500);
			$dom.unbind('ended').on('ended', function() {
//			    $play.removeClass('shake');
				clearInterval(vote.animateTime);
		    });
			return;
		}
		dom.pause();
		clearInterval(vote.animateTime);
//		$play.removeClass('shake');
		//		wx.playVoice({
		//			localId: '' // 需要播放的音频的本地ID，由stopRecord接口获得
		//		});
		//		wx.onVoicePlayEnd({
		//			success: function(res) {
		//				var localId = res.localId; // 返回音频的本地ID
		//			}
		//		});
	});
	$("#works").on("click", ".works_item_image,.works_firstItem_image", function() {
		var paramUrl = 'openid=' + vote.openId + '&state=' + vote.activityId;
		if($(this).parents('.works_firstItem')[0]) {
			window.location.href = "detailed.html?" + paramUrl + "&id=" + $(this).parents('.works_firstItem').attr("id");
		} else {
			window.location.href = "detailed.html?" + paramUrl + "&id=" + $(this).parent().attr("id");
		}
	});

}
vote.animate = function(obj){
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
vote.countTime = function() {
	$("#countDown_bd").html("");
	var timeLeft = Date.parse(new Date('2016-7-31')) - Date.parse(new Date());
	if(timeLeft < 0) {
		weapp.errorToast("活动已结束");
	}
	var s = 24 * 60 * 60 * 1000;
	var day = parseInt(timeLeft / s);
	var hour = parseInt((timeLeft - day * s) / (3600 * 1000));
	var minute = parseInt((timeLeft - day * s - hour * 3600 * 1000) / (60 * 1000));
	var second = parseInt((timeLeft - day * s - hour * 3600 * 1000 - minute * 60 * 1000) / 1000);
	vote.ms = vote.ms - 5;
	if(vote.ms == 0) {
		vote.ms = 1000;
	}
	var html = "<span>距活动结束还有：</span><br/><span>" + day + " 天 " + hour + " 小时 " + minute +
		" 分钟 " + second + " 秒 " + vote.ms + "</span>";
	$("#countDown_bd").append(html);
}
vote.acquireActivity = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/activitymanagement/get', {
		id: vote.activityId,
		openid: vote.openId
	}, vote.acquireActivity_callback);
}
vote.acquireActivity_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try {
		response = JSON.parse(responseData);
	} catch(e) {
		response = responseData;
	}
	if(response.code == 200) {
		vote.activityData = response.data;
//		vote.init();
		jsSDk.initWx(vote.signatureData);
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}

}
vote.fillInActivity = function() {
	$("#activityImg").attr("src", weapp.config.url + '/activitymanagement/getattach?mongoid=' + vote.activityData.picture);
	$(".num").eq(0).html(vote.activityData.numreg);
	$(".num").eq(1).html(vote.activityData.numvote);
	$(".num").eq(2).html(vote.activityData.numhits);
	$("#selectItem").append('<div class="selectItem_bd"><span>全部</span></div>');
	for(var i = 0; i < vote.activityData.taglist.length; i++) {
		var html = '<div class="selectItem_bd" id="' + vote.activityData.taglist[i].id + '"><span>' + vote.activityData.taglist[i].tagname + '</span></div>';
		$("#selectItem").append(html);
	}
	if(4 < vote.activityData.taglist.length <= 9) {
		$('.selectItem_bd').eq(4).css("border-top-right-radius", "6px");
		$('.selectItem_bd').eq(4).css("border-bottom-right-radius", "6px");
		$('.selectItem_bd').eq(5).css("border-top-left-radius", "6px");
		$('.selectItem_bd').eq(5).css("border-bottom-left-radius", "6px");
		$('.selectItem_bd').eq(5).css("width", "25%");
		$('.selectItem_bd').eq(6).css("width", "25%");
		$('.selectItem_bd').eq(7).css("width", "25%");
		$('.selectItem_bd').eq(8).css("width", "25%");
	}
	else if(vote.activityData.taglist.length == 10){
		$('.selectItem_bd').eq(4).css("border-top-right-radius", "6px");
		$('.selectItem_bd').eq(4).css("border-bottom-right-radius", "6px");
		$('.selectItem_bd').eq(5).css("border-top-left-radius", "6px");
		$('.selectItem_bd').eq(5).css("border-bottom-left-radius", "6px");
	}
}
vote.acquireWorkList = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/list', {
		openid: vote.openId,
		activityid: vote.activityId,
		page: vote.pageIndex,
		size: 20
	}, vote.acquireWorkList_callback);
}
vote.acquireWorkList_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try {
		response = JSON.parse(responseData);
	} catch(e) {
		response = responseData;
	}
	if(response.code == 200) {
		if(vote.pageIndex == 1) {
			$("#works li").html("");
			$("#works #firstItem").html("");
			$(".selectItem_bd").eq(0).addClass("active");
			$(".selectItem_bd").eq(0).siblings().removeClass('active');
		}

		for(var i = 0; i < response.data.list.length; i++) {
			var html = "<div class='works_item' id='" + response.data.list[i].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[i].num + "号</span><span class='works_item_userName'>" + response.data.list[i].username + "</span></div>" +
				"<img class='works_item_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[0].mongoid + 
				"' /><div class='works_item_play'><div class='works_item_play_bd'>第<span>" + response.data.list[i].rank +
				"</span>名</div><div class='works_item_play_bd'><audio id='myAudio" + response.data.list[i].num + "' src='" + weapp.config.url + 
				'/voice/getvoice?voiceid=' + response.data.list[i].voiceid + "'></audio><div class='playBtn'><img src='../images/voice3.png' class='voice'/></div></div>" +
				"</div><div class='works_item_vote'><div class='works_item_vote_bd'><span class='voteNum'>" + (response.data.list[i].numvote || 0) + 
				"</span>票</div><div class='works_item_vote_bd'><div class='voteBtn'><span>投票</span></div></div></div></div>";
			if(i % 2 == 0) {
//				if(parseInt($("#works li").eq(0).css('height')) - parseInt($("#works li").eq(1).css('height')) > 392)
				$("#works li").eq(0).append(html);
			} else {
				$("#works li").eq(1).append(html);
			}
		}
		if(response.data.list[0]) {
			vote.pageIndex = response.data.nextPage;
		}
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
	vote.myScroll.refresh();
}
vote.acquireRankedWorks = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/orderbynumvote', {
		openid: vote.openId,
		activityid: vote.activityId,
		page: vote.pageIndex,
		size: 20
	}, vote.acquireRankedWorks_callback);
}
vote.acquireRankedWorks_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try {
		response = JSON.parse(responseData);
	} catch(e) {
		response = responseData;
	}
	if(response.code == 200) {
		var i = 0;
		if(vote.pageIndex == 1) {
			$("#works li").html("");
			$("#works #firstItem").html("");
			$(".selectItem_bd").eq(0).addClass("active");
			$(".selectItem_bd").eq(0).siblings().removeClass('active');
			var html = "<div class='works_firstItem' id='" + response.data.list[0].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[0].num + "号</span><span class='works_item_userName'>" + response.data.list[0].username +
				"</span></div><div class='works_firstItem_bd'><img class='works_firstItem_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' +
				response.data.list[0].picthumbnails[0].mongoid + "' /><img class='works_firstItem_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[0].picthumbnails[1].mongoid + "' />" +
				"</div><div class='works_firstItem_bottom'><div class='works_firstItem_bottom_bd' id='works_firstItem_rank'>第<span>" + response.data.list[0].rank +
				"</span>名</div><div class='works_firstItem_bottom_bd' id='works_firstItem_voteNum'><span  class='voteNum'>" + (response.data.list[0].numvote || 0) +
				"</span>票</div><div class='works_firstItem_bottom_bd'><audio id='myAudio" + response.data.list[0].num + "' src='" + weapp.config.url + '/voice/getvoice?voiceid=' +
				response.data.list[i].voiceid + "'></audio><div class='firstPlayBtn'><img src='../images/voice3.png' class='voice'/></div></div><div class='works_firstItem_bottom_bd'><div id='voteBtn' class='voteBtn'><span>投票</span></div></div></div></div>";
			$('#works #firstItem').append(html);
			i = 1;
		}
		for(; i < response.data.list.length; i++) {
			var html = "<div class='works_item' id='" + response.data.list[i].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[i].num + "号</span><span class='works_item_userName'>" + response.data.list[i].username + "</span></div>" +
				"<img class='works_item_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[0].mongoid + 
				"' /><div class='works_item_play'><div class='works_item_play_bd'>第<span>" + response.data.list[i].rank +
				"</span>名</div><div class='works_item_play_bd'><audio id='myAudio" + response.data.list[i].num + "' src='" + weapp.config.url + 
				'/voice/getvoice?voiceid=' + response.data.list[i].voiceid + "'></audio><div class='playBtn'><img src='../images/voice3.png' class='voice'/></div></div>" +
				"</div><div class='works_item_vote'><div class='works_item_vote_bd'><span  class='voteNum'>" + (response.data.list[i].numvote || 0) + 
				"</span>票</div><div class='works_item_vote_bd'><div class='voteBtn'><span>投票</span></div></div></div></div>";
			if(i % 2 == 1) {
				$("#works li").eq(0).append(html);
			} else {
				$("#works li").eq(1).append(html);
			}
		}
		if(response.data.list[0]) {
			vote.pageIndex = response.data.nextPage;
		}
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
	vote.myScroll.refresh();
}
vote.acquireTagWorkList = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/findbytagid', {
		openid: vote.openId,
		activityid: vote.activityId,
		tagid: vote.tagId,
		page: vote.pageIndex,
		size: 20
	}, vote.acquireTagWorkList_callback);
}
vote.acquireTagWorkList_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try {
		response = JSON.parse(responseData);
	} catch(e) {
		response = responseData;
	}
	if(response.code == 200) {
		if(vote.pageIndex == 1) {
			$("#works li").html("");
			$("#works #firstItem").html("");
		}
		for(var i = 0; i < response.data.list.length; i++) {
			var html = "<div class='works_item' id='" + response.data.list[i].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[i].num + "号</span><span class='works_item_userName'>" + response.data.list[i].username + "</span></div>" +
				"<img class='works_item_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[0].mongoid + 
				"' /><div class='works_item_play'><div class='works_item_play_bd'>第<span>" + response.data.list[i].rank +
				"</span>名</div><div class='works_item_play_bd'><audio id='myAudio" + response.data.list[i].num + "' src='" + weapp.config.url +
				'/voice/getvoice?voiceid=' + response.data.list[i].voiceid + "'></audio><div class='playBtn'><img src='../images/voice3.png' class='voice'/></div></div>" +
				"</div><div class='works_item_vote'><div class='works_item_vote_bd'><span class='voteNum'>" + (response.data.list[i].numvote || 0) + 
				"</span>票</div><div class='works_item_vote_bd'><div class='voteBtn'><span>投票</span></div></div></div></div>";
			if(i % 2 == 0) {
				$("#works li").eq(0).append(html);
			} else {
				$("#works li").eq(1).append(html);
			}
		}
		if(response.data.list[0]) {
			vote.pageIndex = response.data.nextPage;
		}
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
	vote.myScroll.refresh();
}
vote.acquireRankedTagWorkList = function() {
	$('#loadingToast').show();
	$.post(weapp.config.url + '/work/findbytagid', {
		openid: vote.openId,
		activityid: vote.activityId,
		tagid: vote.tagId,
		page: vote.pageIndex,
		size: 20
	}, vote.acquireRankedTagWorkList_callback);
}
vote.acquireRankedTagWorkList_callback = function(responseData) {
	$('#loadingToast').hide();
	var response;
	try {
		response = JSON.parse(responseData);
	} catch(e) {
		response = responseData;
	}
	if(response.code == 200) {
		var i = 0;
		if(vote.pageIndex == 1) {
			$("#works li").html("");
			$("#works #firstItem").html("");
			var html = "<div class='works_firstItem' id='" + response.data.list[0].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[0].num + "号</span><span class='works_item_userName'>" + response.data.list[0].username +
				"</span></div><div class='works_firstItem_bd'><img class='works_firstItem_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' +
				response.data.list[0].picthumbnails[0].mongoid + "' /><img class='works_firstItem_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[0].picthumbnails[1].mongoid + "' />" +
				"</div><div class='works_firstItem_bottom'><div class='works_firstItem_bottom_bd' id='works_firstItem_rank'>第<span>" + response.data.list[0].rank +
				"</span>名</div><div class='works_firstItem_bottom_bd' id='works_firstItem_voteNum'><span  class='voteNum'>" + (response.data.list[0].numvote || 0) +
				"</span>票</div><div class='works_firstItem_bottom_bd'><audio id='myAudio" + response.data.list[0].num + "' src='" + weapp.config.url + '/voice/getvoice?voiceid=' + 
				response.data.list[i].voiceid + "'></audio><div class='firstPlayBtn'><img src='../images/voice3.png' class='voice'/></div></div><div class='works_firstItem_bottom_bd'><div id='voteBtn' class='voteBtn'><span>投票</span></div></div></div></div>";
			$('#works #firstItem').append(html);
			//			$("#" + response.data.list[0].id).find('.voteBtn').attr('isVoted', response.data.list[0].isvoted);
			//			if($("#" + response.data.list[0].id).find('.voteBtn').attr('isVoted') == 'true') {
			//				$("#" + response.data.list[0].id).find('.voteBtn').addClass('voteBtned');
			//				$("#" + response.data.list[0].id).find('.voteBtn').text('已投票');
			//			}
			//			for(var j = 0; j < response.data.list[0].picthumbnails.length; j++) {
			//				$("#" + response.data.list[0].id).find('.works_firstItem_image').eq(j).attr("src", weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[0].picthumbnails[j].mongoid);
			//			}
			i = 1;
		}
		for(; i < response.data.list.length; i++) {
			var html = "<div class='works_item' id='" + response.data.list[i].id + "'><div class='works_item_description'>" +
				"<span class='works_item_num'>" + response.data.list[i].num + "号</span><span class='works_item_userName'>" + response.data.list[i].username + "</span></div>" +
				"<img class='works_item_image' src='" + weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[0].mongoid +
				"' /><div class='works_item_play'><div class='works_item_play_bd'>第<span>" + response.data.list[i].rank +
				"</span>名</div><div class='works_item_play_bd'><audio id='myAudio" + response.data.list[i].num + "' src='" + weapp.config.url + 
				'/voice/getvoice?voiceid=' + response.data.list[i].voiceid + "'></audio><div class='playBtn'><img src='../images/voice3.png' class='voice'/></div></div>" +
				"</div><div class='works_item_vote'><div class='works_item_vote_bd'><span  class='voteNum'>" + (response.data.list[i].numvote || 0) + 
				"</span>票</div><div class='works_item_vote_bd'><div class='voteBtn'><span>投票</span></div></div></div></div>";
			if(i % 2 == 1) {
				$("#works li").eq(0).append(html);
			} else {
				$("#works li").eq(1).append(html);
			}
			//			$("#" + response.data.list[i].id).find('.voteBtn').attr('isVoted', response.data.list[i].isvoted);
			//			if($("#" + response.data.list[i].id).find('.voteBtn').attr('isVoted') == 'true') {
			//				$("#" + response.data.list[i].id).find('.voteBtn').addClass('voteBtned');
			//				$("#" + response.data.list[i].id).find('.voteBtn').text('已投票');
			//			}
			//			if(response.data.list[i].picthumbnails[0]) {
			//				$("#" + response.data.list[i].id).find('.works_item_image').attr("src", weapp.config.url + '/attach/getattach?mongoid=' + response.data.list[i].picthumbnails[0].mongoid);
			//			}
		}
		if(response.data.list[0]) {
			vote.pageIndex = response.data.nextPage;
		}
	} else {
		$("#dialog2").find('.weui_dialog_bd').text(response.msg);
		$('#dialog2').show().on('click', '.weui_btn_dialog', function() {
			$('#dialog2').off('click').hide();
		});
	}
	vote.myScroll.refresh();
}
vote.voteAdd = function() {
	$('#loadingToast').show();
	var param = {
		id: vote.voteId,
		openid: vote.openId
	};
	weapp.getData('post', weapp.config.url + '/work/voteadd', param, function(jsonData) {
		vote.voteAdd_callback(jsonData);
	});
}
vote.voteAdd_callback = function(response) {
	$('#loadingToast').hide();
	//	var response = JSON.parse(responseData);
	if(response.code == 200) {
		//		$("#" + vote.voteId).find('.voteBtn').attr('isVoted', true);
		//		$("#" + vote.voteId).find('.voteBtn').addClass('voteBtned');
		$("#" + vote.voteId).find(".voteNum").text(parseInt($("#" + vote.voteId).find(".voteNum").text()) + 1);
		$('#voteNum .num').text(parseInt($('#voteNum .num').text()) + 1);
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
		vote.openId = urlParam.openid;
	}
	if(urlParam.state) {
		vote.activityId = urlParam.state;
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
				vote.signatureData = jsonData;
				vote.acquireActivity();
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
					vote.init();
				}
			});
			wx.onMenuShareAppMessage({
				title: vote.activityData.activityname, // 分享标题
				desc: vote.activityData.description, // 分享描述
				link: vote.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url + '/activitymanagement/getattach?mongoid=' + vote.activityData.messagepic, // 分享图标
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
				title: vote.activityData.activityname, // 分享标题
				link: vote.activityData.activityURL, // 分享链接
				imgUrl: weapp.config.url + '/activitymanagement/getattach?mongoid=' + vote.activityData.messagepic, // 分享图标
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
