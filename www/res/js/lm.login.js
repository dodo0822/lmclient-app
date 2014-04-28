define([
	'jquery',
	'lm',
	'lm.ui',
	'jquery.cookie',
	'bootstrap'
], function($, LM){
	LM.login = {
		
		loggedIn: function(){
			return (LM.storage.load("mac") != undefined);
		},
		
		showForm: function(){
			$("#login-form").submit(function(){
				$("#login-button").button("loading");
				LM.login.doLogin();
				return false;
			});
			$("#login-button").click(function(){ $("#login-form").submit(); });
		
			LM.ui.modal($("#login-dialog"), true);
		},
		
		showLogout: function(){
			$("#logout-button").click(function(){
				$(this).button("loading");
				LM.login.doLogout();
				return false;
			});
			$("#logout-cancel-button").click(function(){
				LM.ui.hideModal();
			});
			LM.ui.modal($("#logout-dialog"), false);
		},
		
		doLogin: function(){
			LM.storage.save("mac", $("#mac-address").val());
			location.reload();
			return false;
		},
		
		doLogout: function(){
			LM.storage.remove("mac");
			location.reload();
		}
		
	};
});