Meteor.startup( function () {
	if ( Meteor.isClient ) {
		utils.navigation({pluginRoute:`/manageItems`, pluginDisplayName:"Inventory"});
	}
});