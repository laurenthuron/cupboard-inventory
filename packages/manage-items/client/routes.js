Router.route('/manageItems', function () {
	this.render('manageItems', {
		to: 'main',
		// data: function () {
		// 	return inventory.find();
		// }
	})
});