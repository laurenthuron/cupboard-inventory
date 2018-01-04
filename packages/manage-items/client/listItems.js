Template.listItems.onCreated( function () {
	this.subscribe('Inventory');
});

Template.listItems.onRendered( function () {
	Session.setDefault('manage-items.listItems.editItemId', null);
});

Template.listItems.helpers({
	inventoryList: function () {
		return Inventory.find();
	},
	inStock: function (stockLevel) {
		if ( stockLevel > 0 ) {
			return `In stock: ${stockLevel}`;
		} else {
			return `Out of stock`;
		}
	},
	isFavorite: function (bool) {
		return (bool) ? 'glyphicon-star' : 'glyphicon-star-empty';
	}
});

Template.listItems.events({
	"click span.editable" ( event, template ) {
		event.preventDefault();
		
		const itemId = $(event.target).attr('data-id');
		Session.set('manage-items.listItems.editItemId', itemId);
		$('#editItemModal').modal('toggle');
	},
	"click .removeFromStock" ( event, template ) {
		Meteor.call('removeFromStock', this._id, function ( error, result ) {
			if ( error ) {
				console.log(error);
			}
		});
	},
	"click .addToStock" ( event, template ) {
		Meteor.call('addToStock', this._id, function ( error, result ) {
			if ( error ) {
				console.log(error);
			}
		});
	},
	"click .setFavorite" ( event, template ) {
		event.preventDefault();
		
		const itemId = $(event.target).closest('.editItem').find('h5').attr('data-id');
		Meteor.call('favorite', itemId, function ( error, result ) {
			if ( error ) {
				console.log(error)
			}
		});
	}
});