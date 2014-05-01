/*For storage, assume JSON and jq.cookie */
/*To-dos:
  1. JSON parse and stringify
  2. `flush` and cache system to speed up
*/

define(['jquery', 'jquery.cookie', 'jquery.timeago'], function($){
	console.log("LM");

	var storageAvailable= (!!localStorage);
	var storeUtil = storageAvailable ? {
			save: function(key,value){return localStorage.setItem(key,value)},
			load: function(key){return key===undefined?localStorage:localStorage.getItem(key)},
			remove: function(key){return localStorage.removeItem(key)},
			clear: function(){return localStorage.clear()}
		}:{
			save: function(key,value){return $.cookie(key,value)},
			load: function(key){return $.cookie(key)},
			remove: function(key){return $.removeCookie(key)},
			clear: function(){
				_.each($.cookie(),function(val,k){$.removeCookie(k)});
			}
		};

	jQuery.timeago.settings.strings = {
		prefixAgo: null,
		prefixFromNow: "從現在開始",
		suffixAgo: "前",
		suffixFromNow: null,
		seconds: "不到 1 分鐘",
		minute: "大約 1 分鐘",
		minutes: "%d 分鐘",
		hour: "大約 1 小時",
		hours: "%d 小時",
		day: "大約 1 天",
		days: "%d 天",
		month: "大約 1 個月",
		months: "%d 個月",
		year: "大約 1 年",
		years: "%d 年",
		numbers: [],
		wordSeparator: ""
	};
		
	return {
		APOLLO_URL: "https://apollo.omcompany.com:5443/api/",
		SEARCH_URL: "https://mercury.omcompany.com:5443/",
		PROXY_URL: "http://ggt.tw/learnmode/proxy/",
		
		EMOTIONS: [
			"(清除表情)","熱愛","喜歡","無評論","討厭","憤怒"
		],
		
		util: {

			getMac: function(){
				return storeUtil.load("mac");
			},

			getImageUrl: function(id, size){
				if(typeof size === 'undefined') return 'https://apollo.omcompany.com:5443/image/' + id;
				else return 'https://apollo.omcompany.com:5443/image/' + id + '?size=' + size;
			},

			log: function(tag, msg){
				console.log('[' + tag + '] ' + msg);
			},
			
			getStrongName: function(a, b){
				if(a.get('id') == b.get('id')) return '他自己';
				else return ('<strong>' + b.get('name') + '</strong>');
			},
			
			getSelection: function(){
				if(typeof window.getSelection === 'function'){
					return window.getSelection().toString();
				} else {
					// IE
					return document.selection.createRange().text;
				}
			}
			
		},
		
		storage: storeUtil
	}
});