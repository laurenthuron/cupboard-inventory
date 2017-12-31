const categories = {
Dessert: "flaticon-icecream-cup",
Entree: "flaticon-croissant",
MainCourse: "flaticon-restaurant-utensils",
Salad: "flaticon-apple-and-grapes-on-a-bowl",
Meat: "flaticon-meat-slice",
Poultry: "flaticon-chicken-leg",
Vegetarian: "flaticon-fresh-carrot",
Vegan: "flaticon-watermelon-slice"
};

Template.listRecipes.onCreated( function () {
	this.subscribe('Recipes');
});

Template.listRecipes.onRendered( function () {
	Session.setDefault('manage-recipes.listRecipes.editRecipeId', null);
});

Template.listRecipes.helpers({
	recipeList: function () {
		return Recipes.find();
	},
	getCategoryIcon: function ( category ) {
		return categories[category];
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