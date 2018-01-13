Meteor.publish('search', function ( search, dbName ) {
	check( search, Match.OneOf( String, null, undefined ) );
	check ( dbName, String );
	const currentUserId = this.userId;
	if ( currentUserId ) {
		if (Roles.userIsInRole(currentUserId, ['admin', 'user'])) {
			let query      = {},
					projection = { limit: 10, sort: { createdOn: 1 } };
			
			if ( search ) {
				let regex = new RegExp( search, 'i' );
				
				query = {
					$or: [
						{ itemName: regex },
						{ category: regex },
						{ favorite: regex },
						{ recipeName: regex }
					]
				};
				
				projection.limit = 100;
			}
			if ( dbName === "_searchAll" ) {
				let cursor = [];
				for ( let collection in utils.dbIndex ) {
					if ( collection !== "_searchAll" ) {
						cursor.push(utils.dbIndex[collection].find( query, projection ));
					}
				}
				return cursor;
			}
			return utils.dbIndex[dbName].find( query, projection );
		} else {
			this.stop();
			return;
		}
	}
});