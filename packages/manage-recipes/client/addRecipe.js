Template.addRecipeModal.onCreated(function () {
	Session.setDefault('manage-recipes.addRecipeModal.hasError', false);
});

Template.addRecipeModal.helpers({
	hasError: function () {
		return Session.get('manage-recipes.addRecipeModal.hasError');
	}
});

AutoForm.hooks({
	insertRecipeForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			const self = this;
			Meteor.call('addRecipe', insertDoc, function ( error, result ) {
				if ( error ) {
					self.done(error);
				}
				if ( result ) {
					self.done();
				}
			});
		},
		onSuccess: function (formType, result) {
			$('#addRecipeModal').modal('hide');
		},
		onError: function (error) {
		
		}
	}
});