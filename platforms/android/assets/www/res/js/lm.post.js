define([
'lm',
'jquery',
'underscore',
'text!tpl/post-share.html',
'text!tpl/post-details.html',
'text!tpl/post-details-reply.html',
'text!tpl/reply-form.html',
'text!tpl/basic-dialog.html',
'bootstrap',
'lm.ui',
'lm.app',
'lm.http',
'lm.models',
'lm.badges',
'lm.markup',
'magnific-popup',
'history'
], function(LM, $, _, tplPostShare, tplPostDetails, tplPostDetailsReply, tplReplyForm, tplBasicDialog){
	LM.post = {
		
		currentPostId: "",
		currentPostCategory: "",
		currentQuestionSubject: "",
		oldestReplyId: undefined,
		newestReplyId: undefined,
		$postDialog: undefined,
		$postArea: undefined,
		$replyArea: undefined,

		initialize: function(){
			setInterval("require(['lm', 'lm.post'], function(LM){LM.post.checkTrack();});", 30000);
		},
		
		loadPost: function(postId){
			$postDialog = $(tplBasicDialog);
			$postArea = $('<div id="post-area"></div>');
			$replyForm = $(tplReplyForm);
			$replyArea = $('<div id="reply-area"></div>');
			$postDialog.append($postArea).append($replyForm).append($replyArea);
			LM.ui.modal($postDialog, false, {
				callbacks: {
					close: function(){
						LM.post.currentPostId = "";
						LM.post.currentPostCategory = "";
						LM.post.currentQuestionSubject = "";
						if(LM.ui.historyBack) LM.ui.historyBack = false;
						else History.back();
					}
				}
			});
			LM.post.currentPostId = postId;
			LM.http.createLMRequest('read', {id: postId}, LM.post.loadPostCB);
			LM.post.newestReplyId = undefined;
			LM.post.loadReply(postId);
		},
		
		loadReply: function(postId, before){
			LM.util.log('lmPost', 'loadReply => ' + postId);
			if(before === undefined) $replyArea.html('');
			$replyArea.append(LM.ui.getLoaderIcon());
			var options = {};
			if(before !== undefined) options.before = before;
			LM.http.createLMRequest('list', $.extend({related: postId, sort: 'date', count: 25}, options), LM.post.loadReplyCB);
		},
		
		loadPostCB: function(resp){
			var post = new LM.models.Post();
			post.set(resp.list[0]);
			var user = new LM.models.User();
			user.set(resp.users[post.get('from')]);
			var attr = post.attributes;
			attr.user = user.attributes;
			$postArea.append($(_.template(tplPostDetails, attr)));
			//add lightbox
			LM.ui.registerImagePopups();
			LM.markup.render($('.post-main'));
			
			$trackButton = $(".track-button");
			var track = LM.userdata.get('track');
			if(track == "") track = {};
			if(track[LM.post.currentPostId] !== undefined){
				LM.util.log('lmPost', 'set button to pushed');
				console.log($trackButton);
				$trackButton.html("已追蹤").addClass('active');
			}
			
			$("#reply-form").submit(function(){
				LM.post.doPostReply();
				return false;
			});
		},
		
		loadReplyCB: function(resp){
			if(LM.post.newestReplyId === undefined) LM.post.newestReplyId = resp.info.newest;
			var layout = "";
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

			list.forEach(function(post){
				var attr = post.attributes;
				var user = users.get(attr.from);
				attr.user = user.attributes;
				layout += _.template(tplPostDetailsReply, attr);
			});

			if(resp.info.more == true){
				LM.post.oldestReplyId = resp.info.oldest;
				layout += '<div style="text-align: center; padding-top: 10px;"><button class="btn btn-info post-more-button">載入更多</button></div>';
			}

			var $loader = $replyArea.children(".loader");
			
			LM.ui.fadeOut($loader, function(){
				$replyArea.append(layout);
				$(".post-more-button").click(function(){
					LM.util.log('lmApp', 'moreButton::click --> ' + LM.post.oldestReplyId);
					$(this).parent().remove();
					LM.post.loadReply(LM.post.currentPostId, LM.post.oldestReplyId);
				});
				//add lightbox
				LM.ui.registerImagePopups();
				LM.markup.render($('.post-main'));
				$(".post-content").children("button").unbind('click').click(LM.post.doToggleTrack);
			});
		},

		checkTrack: function(){
			var track = LM.userdata.get('track');
			if(track === "") track = {};
			$.each(track, function(id, newest){
				LM.util.log('lmTrack', 'checkTrack(' + id + ',' + newest + ')');
				LM.http.createLMRequest('list', {related: id, sort: 'date', count: 1}, function(resp){
					if(resp.info.newest !== newest){
						LM.util.log('lmTrack', 'new!! ' + resp.info.newest);
						track[id] = resp.info.newest;
						LM.userdata.set('track', track);
					}
				});
			});
		},
		
		showPostDialog: function(){
			LM.ui.modal($(tplPostShare), true);
			$("#share-cancel-button").click(function(e){
				e.preventDefault();
				LM.ui.hideModal();
			});
			$("#share-form").submit(function(e){
				LM.post.doPostShare();
				LM.ui.hideModal();
				return false;
			});
		},
		
		doToggleTrack: function(){
			LM.util.log('lmPost', 'doToggleTrack --> ' + LM.post.currentPostId + ',' + LM.post.newestReplyId);
			var track = LM.userdata.get('track');
			if(track === ""){
				track = {};
			}
			var on = false;
			if(track[LM.post.currentPostId] === undefined) on = true;
			if(on) track[LM.post.currentPostId] = LM.post.newestReplyId;
			else delete track[LM.post.currentPostId];
			LM.userdata.set('track', track);
			LM.ui.info('成功' + (on?'':'解除') + '追蹤貼文！');
			$(".track-button").html(on?"已追蹤":"追蹤");
		},
		
		doPostShare: function(){
			var formData = new FormData();
			formData.append("message", $("#share-content").val());
			formData.append("subject", "Architecture");
			formData.append("category", "share");
			formData.append("device", LM.util.getMac());
			formData.append("application", "com.htc.learnmode");
			if(document.getElementById("share-file").files && document.getElementById("share-file").files[0]) formData.append("image", document.getElementById("share-file").files[0]);
			LM.http.createProxyRequest("postShare", formData, function(resp){
				LM.util.log('lmPost', 'doPostShare::successCB');
				LM.ui.info("貼文成功！");
				LM.app.loadHome(undefined, LM.app.newestPostId);
			});
		},
		
		doPostReply: function(){
			var formData = new FormData();
			formData.append("message", $("#reply-content").val());
			if(LM.post.currentPostCategory === "question") formData.append("subject", LM.post.currentQuestionSubject);
			else formData.append("subject", "Architecture");
			
			if(LM.post.currentPostCategory === "question") formData.append("category", "answer");
			else formData.append("category", "comment");
			formData.append("device", LM.util.getMac());
			formData.append("application", "com.htc.learnmode");
			formData.append("related", LM.post.currentPostId);
			if(document.getElementById("reply-file").files && document.getElementById("reply-file").files[0]) formData.append("image", document.getElementById("reply-file").files[0]);
			
			if(LM.post.currentPostCategory === "question"){
				LM.http.createProxyRequest("postAnswer", formData, function(resp){
					LM.util.log('lmPost', 'doPostReply::answerSuccessCB');
					LM.ui.info("回應成功！");
					LM.post.loadReply(LM.post.currentPostId);
					$("#reply-form-collapse").collapse('hide');
					$("#reply-content").val('');
				});
			} else {
				LM.http.createProxyRequest("postComment", formData, function(resp){
					LM.util.log('lmPost', 'doPostReply::successCB');
					LM.ui.info("回應成功！");
					LM.post.loadReply(LM.post.currentPostId);
					$("#reply-form-collapse").collapse('hide');
					$("#reply-content").val('');
				});
			}
		}
	
	};
});
