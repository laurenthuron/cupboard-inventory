utils = {};
// Check if the string is a valid URL
utils.validURL = function ( str ) {
	const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	return pattern.test( str );
};

// Capitalize the first letter of a string
utils.capitalizeFirstLetter = function ( string ) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

// utils is accessible from both the server and the client but
// will have different functions and properties depending on which side it is on.
// This prevents exposing potentially private information to the client.
if ( Meteor.isClient ) {
	utils.navbar = [];
	utils.pluginButtons = [];
	utils.pluginDb = [];
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