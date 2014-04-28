define(['lm'], function(LM){
	LM.badges = {
		
		createBadgeUrl: function(name){
			return 'res/img/badges/badge_' + name + '_240.png';
		},
		
		LEVEL_NAMES: {
			"novice": "初學者",
			"progress": "大進步",
			"self_learner": "自動自發",
			"advancer": "加速前進",
			"smart": "聰明狂人",
			"enthusiast": "狂熱主義",
			"senior": "資深學人",
			"talent": "才能高超",
			"innovator": "改革創新",
			"researcher": "研究生",
			"influencer": "影響家",
			"motivator": "激勵領袖家",
			"unbeatable": "所向無敵",
			"master": "名家大師",
			"guru": "權威人士",
			"professor": "專家教授"
		},
		
		BADGE_NAMES: {
			"explorer": "探險家",
			"scout": "影武者",
			"vanguard": "好學士",
			"upgrader": "助力士",
			"connector": "博學家",
			"generator": "學問星",
			"trailblazer": "善答星",
			"validator": "讚讚星",
			"apprentice": "實習生",
			"lodestar": "北極星",
			"visionary": "夢想家",
			"discoverer": "發現家",
			"touchstone": "感動家",
			"catalyst": "催化劑"
		},
		
		BADGE_LEVELS: {
			"bronze": "銅牌",
			"silver": "銀牌",
			"gold": "金牌"
		}
		
	};
});