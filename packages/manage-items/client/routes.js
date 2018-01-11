	this.render('manageItems', {
		to: 'main',
		// data: function () {
		// 	return inventory.find();
		// }
	})
Router.route('/manageItems',{
	loadingTemplate: 'loading',
	waitOn: function () {
		return Meteor.subscribe('Inventory');
	},
	action: function () {
	}
});