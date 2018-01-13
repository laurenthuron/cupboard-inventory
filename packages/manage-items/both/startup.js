Meteor.startup( function () {
	if ( Meteor.isClient ) {
		utils.navigation({
			pluginRoute:`/manageItems`,
			pluginDisplayName:"Inventory",
			pluginDisplayImage: "/packages/laurenth_manage-items/resources/food-3048440_640.jpg",
			pluginHomeCardInfo: "List and edit what's in your pantry. Easily find out if you have enough of something for that one recipe you're thinking about!"
		});
		utils.registerPlugin({
			pluginName: "Inventory",
			buttonTemplate: "addItem",
			dbObject: Inventory
		});
		
		Template.registerHelper( 'inStock', function ( stockLevel ) {
			if ( stockLevel > 0 ) {
				return `In stock: ${stockLevel}`;
			} else {
				return `Out of stock`;
			}
		});
		
		Template.registerHelper( 'isFavorite', function ( bool ) {
			return (bool) ? 'glyphicon-star' : 'glyphicon-star-empty';
		});
		
	}
	if ( Meteor.isServer ) {
		utils.addToDBIndex({
			dbName: 'Inventory',
			dbObject: Inventory,
		});
	}
});