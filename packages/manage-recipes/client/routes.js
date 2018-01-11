Router.route('/manageRecipes', {
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('Recipes');
	},
	action: function () {
		this.render('manageRecipes', {
			to: 'main'
		});
		this.render('addRecipe', {
			to: 'pageButtons'
		});
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