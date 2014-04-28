define(['jquery', 'backbone', 'underscore', 'lm', 'jquery.timeago'], function($, Backbone, _, LM){
	LM.models = {

		Badge: Backbone.Model.extend({
			
		}),

		BadgeList: Backbone.Collection.extend({
		}),

		User: Backbone.Model.extend({
			set: function(attributes, options) {
				if (attributes.badges !== undefined && !(attributes.badges instanceof LM.models.BadgeList)) {
					attributes.badges = new LM.models.BadgeList(attributes.badges);
				}

				if(attributes.image !== undefined) {
					attributes.avatar = LM.util.getImageUrl(attributes.image);
				}
				return Backbone.Model.prototype.set.call(this, attributes, options);
			}
		}),

		UserList: Backbone.Model.extend({}),

		Post: Backbone.Model.extend({
			set: function(attributes, options){
				if(attributes.date !== undefined){
					attributes.timeago = $.timeago(attributes.date);
				}
				if(attributes.image != undefined){
					if(attributes.image != ""){
						attributes.imageMedium = LM.util.getImageUrl(attributes.image, 'm');
						attributes.image = LM.util.getImageUrl(attributes.image, 'X');
					}
				}
				return Backbone.Model.prototype.set.call(this, attributes, options);
			}
		}),

		PostList: Backbone.Collection.extend({}),

		Related: Backbone.Model.extend({}),

		RelatedList: Backbone.Model.extend({})

	};
});