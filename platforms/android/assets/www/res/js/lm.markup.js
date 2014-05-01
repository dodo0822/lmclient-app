require([
'lm',
'jquery',
'jquery.linkify'
], function(LM, $){
	LM.markup = {
	
		render: function($target){
			console.log($target);
			$.each($target, function(key, obj){
				var $obj = $(obj);
				if($obj.data("lm-render") !== undefined && $obj.data("lm-render") == "1") return;
				var src = $.trim($obj.text());
				// format
				src = src.replace(/^(#{1,6})(?!#)(.+)$/mg, function(match, p1, p2){
					var cnt = p1.length;
					if(p2.length > cnt){
						var end = p2.substr(p2.length-cnt);
						if(end == p1){
							p2 = p2.substr(0, p2.length-cnt);
						}
					}
					return "<h"+cnt+">" + p2 + "</h"+cnt+">";
				});

				src = src.replace(/([^>])\n/g, '$1<br/>\n');
				src = src.replace(/--\s*(.+?)\s*--/g, "<del>$1</del>");
				src = src.replace(/__\s*(.+?)\s*__/g, "<u>$1</u>");
				$obj.html(src);
			}).linkify();
			$.each($target, function(key, obj){
				var $obj = $(obj);
				if($obj.data("lm-render") !== undefined && $obj.data("lm-render") == "1") return;
				var $obj = $(obj);
				$obj.children('.linkified').prepend('<span class="glyphicon glyphicon-share-alt"></span> ')
					.on('click', function(e){ LM.util.log('lmMarkup', 'render::a click'); e.stopPropagation(); return true; });
				
				$obj.data("lm-render", "1");
			});
		}
	
	};
});