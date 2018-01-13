Template.listRecipes.onCreated( function () {

});

Template.listRecipes.onRendered( function () {
	Session.setDefault('manage-recipes.listRecipes.editRecipeId', null);
});

Template.listRecipes.helpers({
	recipeList: function () {
		return Recipes.find();
	}
});

Template.listRecipes.events({
	"click .editRecipe" ( event, template ) {
		event.preventDefault();
		event.stopImmediatePropagation();
		
		const recipeId = $(event.target).attr('data-id');
		Session.set('manage-recipes.listRecipes.editRecipeId', recipeId);
		$('#editRecipeModal').modal('toggle');
	},
	"click .viewRecipe" ( event, template ) {
		event.preventDefault();
		
		const recipeId = $($(event.target)).find('.editRecipe').attr('data-id');
		Router.go(`/recipe/${recipeId}`);
	}
});