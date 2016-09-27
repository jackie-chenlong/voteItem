var alertTip = {
	// //弹出提示 time,毫秒
	errorToast: function(content, f, time) {
		var toastDom='<div id="toast"><div class="weui_mask_transparent">'+
					'</div><div class="weui_toast"><i class="weui_icon_clear"></i>'+
					'<p class="weui_toast_content"></p></div></div>',
			$toastDom=$(toastDom),
			time = time || 3000;
		if(typeof f === 'function'){
				$toastDom.find('p').text(content);
                $('#container').append($toastDom);
                setTimeout(function () {
                	$toastDom.remove();
					f();
                }, time);
		}
		else{
			$toastDom.find('p').text(content);
            $('#container').append($toastDom);
            setTimeout(function () {
                $toastDom.remove();
            }, time);          
		}
	},

	//弹出完成
	successToast: function(content, f, time) {
		var toastDom='<div id="toast"><div class="weui_mask_transparent">'+
					'</div><div class="weui_toast"><i class="weui_icon_toast"></i>'+
					'<p class="weui_toast_content"></p></div></div>',
			$toastDom=$(toastDom),
			time = time || 3000;
		if(typeof f === 'function'){
				$toastDom.find('p').text(content);
                $('#container').append($toastDom);
                setTimeout(function () {
                	$toastDom.remove();
                }, time);
		}
		else{
			$toastDom.find('p').text(content);
            $('#container').append($toastDom);
            setTimeout(function () {
                $toastDom.remove();
				f();
            }, time);          
		}
	}
};
var weapp = {

	// 一些配置项
	config: {
		url: "http://mp.mesclouds.com:8080/wxVote", // 请求接口的url
		//url: "http://localhost:8080/wxVote", // 请求接口的url
		storage: "", // 这个是localStorage的对象存储
		storageName: "weVote" // 本地storage的item的名字
	},

	//获取localstorage里面的用户信息
	getStorageParam : function(key, value){
		var storage = weapp.config.storage;//reference of localstorage object
		storage = storage || JSON.parse(localStorage.getItem(weapp.config.storageName));
		if(value === undefined)//read
			return storage[key];
		storage[key] = value;
		localStorage.setItem(weapp.config.storageName, JSON.stringify(storage));
	},

	// 获取url的参数
	getParamByUrl: function() {

	   var url = window.location.search; //获取url中"?"符后的字串
	   var theRequest = {};

	   if (url.indexOf("?") !== -1) {

	      var str = url.substr(1),
	      	  strs = str.split("&");
	      for(var i = 0; i < strs.length; i ++) {

	         theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	      }
	   }
	   return theRequest;
	},

		//请求数据接口
	getData: function(type, url, param, f, isAsync, err) {
		var ajaxParam  = {
			type: type,
			url: url,
			data: param,
			cache:false,
			async: isAsync !== false,
			timeout: 30000,
			success: function(data) {
				
				var jsonData;
				try{
					jsonData = $.parseJSON(data);

				}catch(e) { // 返回值不是json格式
					
					if(typeof f !== 'function') { // 如果没有回调函数,抛出异常。

						throw new Error('请求数据之后，没有回调函数!');
					}
					f(data);
					return;
				}
				if(jsonData.code === -1||jsonData.code === -2){
					//后台检查异常处理				
				} else {

					if(typeof f !== 'function') { // 如果没有回调函数,抛出异常。

						throw new Error('请求数据之后，没有回调函数!');
					}
					f(jsonData);
				}
			},
			error: function(xhr,errorType, error) {
				alertTip.errorToast('无法连接服务器', err);
			}
		};
		$.ajax(ajaxParam);
	}
};
