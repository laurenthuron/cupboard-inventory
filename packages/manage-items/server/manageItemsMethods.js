Meteor.methods({
	addItem: function ( doc ) {
		check(doc, {
			itemName: String,
			quantity: Number,
			stock: Number,
			quantity_units: String,
			category: String,
			description: Match.Maybe(String)
		});
		if (Roles.userIsInRole(this.userId, "user")) {
			return Inventory.insert(doc);
		}
		return false;
	},
	editItem: function ( docId, updateDoc ) {
		
		if (Roles.userIsInRole(this.userId, "user")) {
			return Inventory.update(docId, updateDoc);
		}
		return false;
	},
	removeItem: function ( docId ) {
		if (Roles.userIsInRole(this.userId, "user")) {
			return Inventory.remove(docId);
		}
		return false;
	},
	addToStock: function ( docId ) {
		check ( docId, String );
		
		if (Roles.userIsInRole(this.userId, "user")) {
			return Inventory.update(docId, {$inc: {stock: 1}});
		}
		
		return false;
	},
	removeFromStock: function ( docId ) {
		if (Roles.userIsInRole(this.userId, "user")) {
			const item = Inventory.findOne(docId, {fields: {stock: 1}});
			if ( item && item.stock && item.stock > 0 ) {
				return Inventory.update(docId, {$inc: {stock: -1}});
			}
		}
		return false;
	}
});