
Template.addItemModal.onCreated(function () {
	Session.setDefault('manage-items.addItemModal.hasError', false);
});

Template.addItemModal.helpers({
	hasError: function () {
		return Session.get('manage-items.addItemModal.hasError');
	}
});

Template.addItemModal.events({
	"click button[type=submit]" ( event, template ) {
		//event.preventDefault();
	}
});

AutoForm.hooks({
	insertInventoryItemForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			this.event.preventDefault();
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
		onError: function (error) {
			console.log(error);
		}
	}
});