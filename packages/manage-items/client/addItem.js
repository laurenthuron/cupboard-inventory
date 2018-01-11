
Template.addItemModal.onCreated(function () {
	Session.set('manage-items.addItemModal.hasError', false);
});

Template.addItemModal.helpers({
	hasError: function () {
		return Session.get('manage-items.addItemModal.hasError');
	},
	InventorySchema: function () {
		return Inventory.simpleSchema();
	}
});

AutoForm.hooks({
	insertInventoryItemForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			this.event.preventDefault();
			Session.set('manage-items.addItemModal.hasError', false);
			const self = this;
			Meteor.call('addItem', insertDoc, function ( error, result ) {
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
			this.event.preventDefault();
			$('#addItemModal').modal('hide');
			return false;
		},
		onError: function (formType, error) {
			Session.set('manage-items.addItemModal.hasError', error.message);
		}
	}
});