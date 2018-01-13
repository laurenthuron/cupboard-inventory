Template.editRecipeModal.onCreated( function () {

});

Template.editRecipeModal.helpers({
	currentDoc: function () {
		return Recipes.findOne(Session.get('manage-recipes.listRecipes.editRecipeId'));
	}
});

Template.editRecipeModal.events({
	"click .deleteRecipe" ( event, template ) {
		event.preventDefault();
		Meteor.call('removeRecipe', Session.get('manage-recipes.listRecipes.editRecipeId'), function ( error, result ) {
			if ( error ) {
				
			}
			if ( result ) {
				$('#editRecipeModal').modal('hide');
			}
		});
	}
});

AutoForm.hooks({
	editRecipeForm: {
		onSubmit: function (insertDoc, updateDoc, currentDoc) {
			const self = this;
			Meteor.call('editRecipe', currentDoc._id, updateDoc, function ( error, result ) {
				if ( error ) {
					self.done(error);
				}
				if ( result ) {
					self.done();
				}
			});
		},
		onSuccess: function (formType, result) {
			$('#editRecipeModal').modal('hide');
		},
		onError: function (error) {
			
		}
	}
});