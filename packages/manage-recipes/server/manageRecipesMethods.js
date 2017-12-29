Meteor.methods({
	addRecipe: function ( doc ) {
		check(doc, {
			recipeName: String,
			recipeIngredients: Array,
			recipeMethod: Array,
			recipeCategory: String,
			recipeDescription: Match.Maybe(String)
		});
		if (Roles.userIsInRole(this.userId, "user")) {
			return Recipes.insert(doc);
		}
		return false;
	},
	editRecipe: function ( docId, updateDoc ) {
		
		if (Roles.userIsInRole(this.userId, "user")) {
			return Recipes.update(docId, updateDoc);
		}
		return false;
	}
});