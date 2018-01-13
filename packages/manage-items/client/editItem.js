Template.editItemModal.onCreated( function () {
	Session.set('manage-items.addItemModal.hasError', false);
});

Template.editItemModal.helpers({
	currentDoc: function () {
		return Inventory.findOne(Session.get('manage-items.listItems.editItemId'));
	},
	InventorySchema: function () {
		return Inventory.simpleSchema();
	}
});

Template.editItemModal.events({
	"click .deleteItem" ( event, template ) {
		event.preventDefault();
		Meteor.call('removeItem', Session.get('manage-items.listItems.editItemId'), function ( error, result ) {
			if ( error ) {
				console.log( error );
			}
			if ( result ) {
				$('#editItemModal').modal('hide');
			}
		});
	}
});

AutoForm.hooks({
	editInventoryItemForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			this.event.preventDefault();
			Session.set('manage-items.addItemModal.hasError', false);
			const self = this;
			Meteor.call('editItem', currentDoc._id, updateDoc, function ( error, result ) {
				if ( error ) {
					self.done(error);
				}
				if ( result ) {
					self.done();
				}
			});
			return false;
		},
		onSuccess: function (formType, result) {
			$('#editItemModal').modal('hide');
			return false;
		},
		onError: function (formType, error) {
			Session.set('manage-items.addItemModal.hasError', error.message);
		}
	}
});