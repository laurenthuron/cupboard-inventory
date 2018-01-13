/**
 * This search publication can return a simple find on the collection of whichever plugin is indicated
 * by "dbName".
 * There is one special case, when dbName is set to _searchAll. If this happens, the publication will return
 * an array of cursors consisting of the results from all registered plugins collections.
 * @param search {String} - search query
 * #param dbName {String} - acts as an index for which registered plugin collection we need to search in
 */
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
			// special _searchAll case
			if ( dbName === "_searchAll" ) {
				let cursor = [];
				for ( let collection in utils.dbIndex ) {
					if ( collection !== "_searchAll" ) {
						cursor.push(utils.dbIndex[collection].find( query, projection ));
					}
				}
				return cursor;
			}
			// normal collection search return
			return utils.dbIndex[dbName].find( query, projection );
		} else {
			this.stop();
			return;
		}
	}
});