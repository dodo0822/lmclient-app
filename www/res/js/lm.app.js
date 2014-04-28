define([
'lm',
'jquery',
'underscore',
'text!tpl/homepage-post.html',
'lm.login',
'lm.ui',
'lm.http',
'lm.userdata',
'lm.models',
'lm.badges',
'lm.about',
'lm.post',
'lm.markup',
'magnific-popup'
],function(LM, $, _, tplHomepagePost){
	LM.app = {
		oldestPostId: undefined,
		newestPostId: undefined,

		initialize: function(){
			if(!LM.login.loggedIn()) LM.login.showForm();
			else {
				LM.app.registerListeners();
				LM.app.loadProfile();
				LM.app.loadHome();
				LM.userdata.initialize(LM.ui.setFont);
			}
		},

		loadProfile: function(){
			LM.http.createLMRequest('profile/read', {}, function(resp){
				var profile = resp.profile;
				var user = new LM.models.User();
				user.set(profile);
				$("#profile-name").html(user.get('name'));
				LM.app.currentUser = user;
			});
		},
		
		loadHome: function(before, after){
			if(before === undefined && after === undefined) LM.ui.setLayout("");
			var $loader = LM.ui.getLoaderIcon();
			if(after === undefined) $("body").append($loader);
			else $("body").prepend($loader);
			var options = {};
			if(before !== undefined) options.before = before;
			if(after !== undefined) options.after = after;

			LM.http.createLMRequest('list', $.extend({count: 50}, options), function(resp){
				console.log(resp);
				LM.app.newestPostId = resp.info.newest;
				var list = new LM.models.PostList();
				_.each(resp.list, function(post){
					var p = new LM.models.Post();
					p.set(post);
					list.add(p);
				});

				var users = new LM.models.UserList();
				_.each(resp.users, function(user, id){
					var u = new LM.models.User();
					u.set(user);
					var obj = {};
					obj[id] = u;
					users.set(obj);
				});

				var related = new LM.models.RelatedList();
				_.each(resp.related, function(rel, id){
					var r = new LM.models.Related();
					r.set(rel);
					var obj = {};
					obj[id] = r;
					related.set(obj);
				});

				var layout = (after === undefined) ? LM.ui.getLayout() : "";

				list.forEach(function(post){
					var attr = post.attributes;
					if(attr.related != ''){
						var rel = related.get(attr.related).attributes;
						var reluser = users.get(rel.from);
						rel.user = reluser.attributes;
						attr.rel = rel;
					}
					var user = users.get(attr.from);
					attr.user = user.attributes;
					if(attr.category == "comment" || attr.category == "answer"){
						attr.relname = LM.util.getStrongName(user, reluser);
					}
					if(attr.category == "!emotion"){
						attr.message = LM.EMOTIONS[attr.message];
					}
					if(attr.category == "!badge"){
						var b = attr.badge;
						if(LM.badges.BADGE_NAMES[b] !== undefined){
							// Badge
							var b = b.split("_");
							attr.isBadge = true;
							attr.message = LM.badges.BADGE_NAMES[b[0]] + LM.badges.BADGE_LEVEL[b[1]];
							attr.badgeUrl = LM.badges.createBadgeUrl(attr.badge);
						} else {
							attr.isBadge = false;
							attr.message = LM.badges.LEVEL_NAMES[b];
						}
					}
					layout += _.template(tplHomepagePost, attr);
				});

				if(after === undefined && resp.info.more == true){
					LM.app.oldestPostId = resp.info.oldest;
					layout += '<div style="text-align: center; padding-top: 10px;"><button class="btn btn-info btn-lg home-more-button">載入更多</button></div>';
				}

				if(after !== undefined) layout += LM.ui.getLayout();

				LM.ui.fadeOut($loader, function(){ LM.ui.setLayout(layout); LM.app.registerPostListeners(); LM.markup.render($('.post-main')); });
			});
		},
		
		registerPostListeners: function(){
			$(".post").click(function(e){
				if(!LM.util.getSelection()){
					e.preventDefault();
					var c = $(this).data('category');
					if(c == "share" || c == "question" || c == "answer" || c == "comment" || c == "scrapbook" || c == "!emotion"){
						LM.util.log('lmHome', $(this).data('related'));
						LM.post.loadPost($(this).data('related'));
					}
				}
			});
			$(".home-more-button").click(function(){
				LM.util.log('lmApp', 'moreButton::click --> ' + LM.app.oldestPostId);
				$(this).parent().remove();
				LM.app.loadHome(LM.app.oldestPostId);
			});
		},
		
		registerListeners: function(){
			$("#logout-link").click(function(){LM.login.showLogout(); return false;});
			$("#about-link").click(function(){LM.about.showAbout(); return false;});
			$("#settings-link").click(function(){LM.userdata.showSettings(); return false;});
			$("#share-link").click(function(){LM.post.showPostDialog(); return false;});
		}
	};
});