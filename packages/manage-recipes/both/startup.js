Meteor.startup( function () {
	if ( Meteor.isClient ) {
		utils.navigation({
			pluginRoute:`/manageRecipes`,
			pluginDisplayName:"Recipes",
			pluginDisplayImage: "/packages/manage-recipes/resources/food-516044_640.jpg",
			pluginHomeCardInfo: "Add, edit and see which of your recipes you have the ingredients for here!"
		});
		utils.registerPlugin({
			pluginName: "Recipes",
			buttonTemplate: "addRecipe",
			dbObject: Recipes
		});
		
		Template.registerHelper( 'getCategoryIcon', function ( category ) {
			const categories = {
				Dessert: "flaticon-icecream-cup",
				Entree: "flaticon-croissant",
				MainCourse: "flaticon-restaurant-utensils",
				Salad: "flaticon-apple-and-grapes-on-a-bowl",
				Meat: "flaticon-meat-slice",
				Poultry: "flaticon-chicken-leg",
				Vegetarian: "flaticon-fresh-carrot",
				Vegan: "flaticon-watermelon-slice"
			};
			return categories[category];
		});
		
	}
	if ( Meteor.isServer ) {
		utils.addToDBIndex({
			dbName: 'Recipes',
			dbObject: Recipes
		});
	}
});