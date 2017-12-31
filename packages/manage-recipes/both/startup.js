Meteor.startup( function () {
	if ( Meteor.isClient ) {
		utils.navigation({pluginRoute:`/manageRecipes`, pluginDisplayName:"Recipes"});
	}
});