Meteor.startup( function () {
	if ( Meteor.isClient ) {
		utils.navigation({
			pluginRoute:`/manageItems`,
			pluginDisplayName:"Inventory",
			pluginDisplayImage: "/packages/laurenth_manage-items/resources/food-3048440_640.jpg",
			pluginHomeCardInfo: "List and edit what's in your pantry. Easily find out if you have enough of something for that one recipe you're thinking about!"
		});
	}
});