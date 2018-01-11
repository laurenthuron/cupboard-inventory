Router.route('/manageItems',{
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('Inventory');
	},
	action: function () {
		this.render('manageItems', {
			to: 'main'
		});
		this.render('addItem', {
			to: 'pageButtons'
		});
	}
});