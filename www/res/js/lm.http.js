define(
['lm', 'jquery', 'lm.ui'],
function(LM, $){
	LM.http = {

		createLMRequest: function(action, params, successCB){
			var mac = LM.util.getMac();
			LM.util.log("lmRequest", LM.APOLLO_URL + action + "?device=" + mac + "&" + $.param(params));
			$.ajax({
				url: LM.APOLLO_URL + action + "?device=" + mac + "&" + $.param(params),
				type: "GET",
				crossDomain: true,
				dataType: "jsonp",
				success: function(resp){
					if(resp.status == "ok") successCB(resp);
					else {
						LM.ui.error(resp.message);
					}
				},
				error: function(){
					LM.ui.error('連線時發生問題。');
				}
			});
		},

		createProxyGetRequest: function(action, params, successCB){
			var mac = LM.util.getMac();
			var url = LM.PROXY_URL + action + ".php?mac=" + mac + "&" + $.param(params);
			LM.util.log("lmProxyGet", url);
			$.ajax({
				url: url,
				type: "GET",
				crossDomain: true,
				dataType: "jsonp",
				success: successCB,
				error: function(){
					LM.ui.error('取得使用者資料時發生問題。');
				}
			});
		},
		
		createProxyRequest: function(action, data, successCB){
			var mac = LM.util.getMac();
			var url = LM.PROXY_URL + action + ".php?device=" + mac;
			LM.util.log("lmProxyRequest", url);
			$.ajax({
				url: url,
				type: "POST",
				data: data,
				processData: false,
				contentType: false,
				success: successCB,
				error: function(){
					LM.ui.error('向代理伺服器連線時發生問題。');
				}
			});
		}

	};
}
);