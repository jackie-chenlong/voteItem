var myPage = {
	init: function() {},
	bindEvent: function() {}
}
myPage.init = function() {
	myPage.bindEvent();
	$("#homePage").find('img').attr('src','../images/homePage.png');
	$('#ranked').find('img').attr('src','../images/rank.png');
	$('#search').find('img').attr('src','../images/search.png');
	$('#signUp').find('img').attr('src','../images/signUp.png');
}
myPage.bindEvent = function() {
	$('#details').on('click',function(){
		
	});
	$("#homePage").on("click", function() {
		window.location.href = "vote.html";
	});
	$("#signUp").on("click", function() {
		window.location.href = "signUp.html";
	});
	$("#search").on("click", function() {
		window.location.href = "search.html";
	});
	$("#ranked").on("click", function() {
		window.location.href = "vote.html?isRanked=true";
	});
}
myPage.init();