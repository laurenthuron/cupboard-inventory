
Template.addItemModal.onCreated(function () {
	Session.setDefault('manage-items.addItemModal.hasError', false);
});

Template.addItemModal.helpers({
	hasError: function () {
		return Session.get('manage-items.addItemModal.hasError');
	}
});

AutoForm.hooks({
	insertInventoryItemForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			const self = this;
			Meteor.call('addItem', insertDoc, function ( error, result ) {
				if ( error ) {
					self.done(error);
				}
				if ( result ) {
					self.done();
				}
			});
		},
		onSuccess: function (formType, result) {
			$('#addItemModal').modal('hide');
		},
		onError: function (error) {
		
		}
	}
});