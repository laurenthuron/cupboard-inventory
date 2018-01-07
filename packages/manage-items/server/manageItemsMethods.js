Meteor.methods({
	addItem: function ( doc ) {
		check(doc, {
			itemName: String,
			quantity: Number,
			stock: Number,
			quantity_units: String,
			category: String,
			description: Match.Maybe(String),
			itemPrice: Number
		});
		if (Roles.userIsInRole(this.userId, "user")) {
			return Inventory.insert(doc);
		}
		return false;
	},
	editItem: function ( docId, updateDoc ) {
		check ( docId, String );
		check(updateDoc, {
			$set: {
				itemName: String,
				quantity: Number,
				stock: Number,
				quantity_units: String,
				category: String,
				description: Match.Maybe(String),
				itemPrice: Number
			}
		});
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
	},
	favorite: function ( docId ) {
		if (Roles.userIsInRole(this.userId, "user")) {
			const item = Inventory.findOne(docId, {fields: {favorite: 1}});
			if ( item ) {
				let bool = (item.favorite)? false : true;
				return Inventory.update(docId, {$set: {favorite: bool}});
			}
		}
	}
});