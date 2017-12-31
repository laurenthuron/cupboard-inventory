utils = {};
utils.navbar = [];
utils.navigation = function (plugin) {
	check (plugin, Match.OneOf({
		pluginRoute: String,
		pluginDisplayName: String,
		pluginDisplayImage: Match.Maybe(String),
		pluginHomeCardInfo: String
	}, String));
	if (typeof plugin === 'object') {
		this.navbar.push(plugin);
	} else {
		this.navbar.push({pluginRoute:`/${plugin}`, pluginDisplayName:plugin});
	}
};