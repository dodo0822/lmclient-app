define([
'jquery',
'lm',
'underscore',
'text!tpl/settings.html',
'lm.http'], function($, LM, _, tplSettings){

	LM.userdata = {
		data: {},
		initializeCB: undefined,

		initialize: function(initializeCB){
			LM.userdata.initializeCB = initializeCB;
			LM.http.createProxyGetRequest('star', {action: 'load'}, LM.userdata.loadSuccessCB);
		},

		set: function(key, value){
			LM.userdata.data[key] = value;
			LM.userdata.save();
		},

		get: function(key){
			if(LM.userdata.data[key] === undefined) return "";
			else return LM.userdata.data[key];
		},

		save: function(){
			var formData = new FormData();
			formData.append('mac', LM.util.getMac());
			formData.append('json', JSON.stringify(LM.userdata.data));
			LM.http.createProxyRequest('star.php?action=save&', formData, LM.userdata.saveSuccessCB);
		},

		loadSuccessCB: function(resp){
			LM.util.log('lmUserdata', 'loadSuccess');
			console.log(resp);
			LM.userdata.data = resp;
			if(LM.userdata.initializeCB !== undefined){
				LM.userdata.initializeCB();
				LM.userdata.initializeCB = undefined;
			}
		},

		saveSuccessCB: function(resp){
			LM.util.log('lmUserdata', 'saveSuccess');
			console.log(resp);
		},

		showSettings: function(){
			var data = {font: LM.userdata.get('font')};
			$settingsDialog = $(_.template(tplSettings, data));
			LM.ui.modal($settingsDialog, false);
			$("#settings-form").submit(function(){
				LM.userdata.set('font', $('#settings-font').val());
				LM.ui.info('設定儲存成功！請重新整理以獲得效果。');
				LM.ui.hideModal();
				return false;
			})
			$("#settings-cancel-button").click(function(){
				LM.ui.hideModal();
				return false;
			});
		}
	};
});