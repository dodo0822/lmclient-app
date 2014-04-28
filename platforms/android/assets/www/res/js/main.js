require({
	paths: {
		order: '../lib/requirejs/order',
		text: '../lib/requirejs/text',
		jquery: '../lib/jquery/jquery.min',
		'jquery.cookie': '../lib/jquery/jquery.cookie',
		'jquery.timeago': '../lib/jquery/jquery.timeago',
		'jquery.linkify': '../lib/jquery/jquery.linkify.min',
		'magnific-popup': '../lib/magnific-popup/magnific-popup',
		bootstrap: '../lib/bootstrap/js/bootstrap.min',
		'bootstrap-growl': '../lib/bootstrap/js/bootstrap-growl.min',
		backbone: '../lib/backbone/backbone-min',
		underscore: '../lib/underscore/underscore-min',
		prefixfree: '../lib/prefixfree/prefixfree.min',
		shadowbox: '../lib/shadowbox/shadowbox',
		tpl: '../templates'
	},
	shim: {
		'magnific-popup': ['jquery']
	}
});

require([
	'order!lm',
	'order!lm.app',
	'order!prefixfree'
], function(LM){
	LM.app.initialize();
});