Router.route('/manageRecipes', {
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('Recipes');
	},
	action: function () {
	}
});

Router.route('/recipe/:_id', function () {
	this.render('displayRecipe', {
		to: 'main',
		data: function () {
			return Recipes.findOne( { _id: this.params._id } );
		}
	})
});