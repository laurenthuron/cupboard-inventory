Meteor.publish('InventorySearch', function ( search ) {
	check( search, Match.OneOf( String, null, undefined ) );
	const currentUserId = this.userId;
	if ( currentUserId ) {
		if (Roles.userIsInRole(currentUserId, ['admin', 'user'])) {
			let query      = {},
					projection = { limit: 10, sort: { title: 1 } };
			
			if ( search ) {
				let regex = new RegExp( search, 'i' );
				
				query = {
					$or: [
						{ itemName: regex },
						{ category: regex },
						{ favorite: regex }
					]
				};
				
				projection.limit = 100;
			}
			
			return Inventory.find( query, projection );
		} else {
			this.stop();
			return;
		}
	}
});