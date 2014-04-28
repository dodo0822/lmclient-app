define([
'lm',
'text!tpl/about.html'
], function(LM, tplAbout){
	LM.about = {
	
		showAbout: function(){
			LM.ui.modal($(tplAbout), false);
			LM.ui.registerTabs();
		}
	
	};
});