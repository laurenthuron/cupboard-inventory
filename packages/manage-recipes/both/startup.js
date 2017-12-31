Meteor.startup( function () {
	if ( Meteor.isClient ) {
		utils.navigation({
			pluginRoute:`/manageRecipes`,
			pluginDisplayName:"Recipes",
			pluginDisplayImage: "/packages/manage-recipes/resources/food-516044_640.jpg",
			pluginHomeCardInfo: "Add, edit and see which of your recipes you have the ingredients for here!"
		});
	}
});