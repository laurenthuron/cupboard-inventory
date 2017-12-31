Router.route('/manageRecipes', function () {
	this.render('manageRecipes', {
		to: 'main'
	})
});

Router.route('/recipe/:_id', function () {
	this.render('displayRecipe', {
		to: 'main',
		data: function () {
			return Recipes.findOne( { _id: this.params._id } );
		}
	})
});