define(['lm', 'jquery', 'shadowbox', 'magnific-popup', 'bootstrap-growl', 'bootstrap', 'lm.userdata', 'history'], function(LM, $){
	LM.ui = {
		historyBack: false,

		modal: function(target, modal, options){
			if(options === undefined) options = {};
			var config = {
				items: {
					src: target
				},
				removalDelay: 300,
				mainClass: 'mfp-zoom-in',
				modal: modal,
				callbacks: {
					close: function(){
						LM.util.log('lmUi', 'modal::close');
						if(!LM.ui.historyBack) History.back();
						else LM.ui.historyBack = false;
					}
				}
			};
			config = $.extend(config, options);
			$.magnificPopup.open(config);
		},
		
		hideModal: function(){
			$.magnificPopup.close();
		},

		fadeOut: function(target, completeCB){
			target.fadeOut(250, function(){ $(this).remove(); completeCB(); });
		},
		
		getLoaderIcon: function(){
			return $('<div class="loader"><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div></div>');
		},

		error: function(err){
			$.growl('無法與伺服器連線！錯誤：<br />' + err, { type: 'danger' });
		},
		
		info: function(inf){
			$.growl('訊息：<br />' + inf, {type: 'info'});
		},

		getLayout: function(){
			return $("#main").html();
		},

		setLayout: function(content){
			$("#main").html(content);
			LM.ui.registerImagePopups();
		},

		setFont: function(){
			var font = LM.userdata.get('font');
			if(font !== ""){
				var $head = $('head');
				var $link = $('<link />');
				$link.attr("rel", "stylesheet");
				$link.attr("type", "text/css");
				$link.attr("media", "all");
				$link.attr("href", "./res/css/fonts/" + font + ".css");
				$head.append($link);
			}
		},
		
		registerImagePopups: function(){
			Shadowbox.init({
				skipSetup: true
			});
			$(".image-popup").click(function(){
				Shadowbox.open({
					content: $(this).attr("href"),
					player: "img"
				});
				return false;
			});
		},
		
		registerTabs: function(){
			$(".nav-tabs a").click(function(e){
				e.preventDefault();
				$(this).tab('show');
			});
		}

	};
});