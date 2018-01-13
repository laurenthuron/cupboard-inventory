Meteor.startup( function () {
	if ( Meteor.isServer ) {
		// register own plugin
		utils.addToDBIndex({
			dbName: '_searchAll',
			dbObject: {}
		});
	}
});