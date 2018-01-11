utils = {};

if ( Meteor.isClient ) {
	utils.navbar = [];
	utils.pluginButtons = [];
	utils.pluginDb = []
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
	utils.registerPlugin = function ( plugin ) {
		check ( plugin, {
			pluginName: String,
			buttonTemplate: String,
			dbObject: Match.Any
		});
		
		this.pluginButtons[plugin.pluginName] = plugin.buttonTemplate;
		this.pluginDb[plugin.pluginName] = plugin.dbObject;
	}
}

if ( Meteor.isServer ) {
	utils.dbIndex = [];
	utils.addToDBIndex = function ( plugin ) {
		check ( plugin, {
			dbName: String,
			dbObject: Match.Any
		} );
		
		this.dbIndex[plugin.dbName] = plugin.dbObject;
	};
}