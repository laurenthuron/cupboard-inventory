function getButtonsToRender ( context ) {
	if ( Session.get('general.currentPage') ) {
		context.render(utils.pluginButtons[Session.get('general.currentPage')], {
			to: 'pageButtons'
		})
	}
}

Router.route('/search', function () {
	this.render('search', {
		to: 'main'
	});
	getButtonsToRender(this);
});