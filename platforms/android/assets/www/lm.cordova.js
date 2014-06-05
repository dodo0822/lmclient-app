LMmobile = {
	
	deviceReadyCB: function(){
		console.log("lmMobile::devicereadycb");
		//document.addEventListener("backbutton", LMmobile.backButtonCB, false);
	},
	
	backButtonCB: function(){
		console.log("lmMobile::backbuttoncb");
		require(['jquery', 'lm', 'lm.ui', 'shadowbox'], function($, LM){
			if($("#sb-container").css("visibility") == "visible"){
				Shadowbox.close();
			} else {
				require(['history'], function(){ History.back(); });
			}
		});
		return false;
	}
	
};

function onLoad(){
	console.log("onload");
	document.addEventListener("deviceready", LMmobile.deviceReadyCB, false);
}