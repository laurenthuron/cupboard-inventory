Template.searchBar.onCreated( () => {
	let template = Template.instance();

	Session.set('searchBar.searchQuery', '');
	Session.set('searchBar.searching', false);
	
	template.autorun( () => {
		console.log(Session.get('searchBar.searchQuery'))
		template.subscribe( 'search',
				Session.get( 'searchBar.searchQuery' ),
				(Session.get('general.currentPage') || 'Inventory'),
				() => {
					setTimeout( () => {
						Session.set( 'searchBar.searching', false );
					}, 300 );
		});
	});
});

Template.searchBar.helpers({
	currentSearchArea: function () {
		return Session.get('general.currentPage');
	}
});

Template.search.helpers({
	searching: function () {
		return Session.get('searchBar.searching');
	},
	query: function () {
		return Session.get('searchBar.searchQuery');
	},
	searchResult: function () {
		return utils.pluginDb[Session.get('general.currentPage')].find();
	}
});

Template.searchBar.events({
	'click .searchField' ( event, template ) {
		Router.go("search");
	},
	'keyup .searchField' ( event, template ) {
		let value = event.target.value.trim();
		
		if ( value !== '' && event.keyCode !== 13 ) {
			Session.set( 'searchBar.searchQuery', value );
			Session.set( 'searchBar.searching', true );
		}
		
		if ( value === '' ) {
			Session.set( 'searchBar.searchQuery', value );
		}
	},
	'click button.search-btn' ( event, template ) {
		event.preventDefault();
		$('.searchField').val('');
		Session.set( 'searchBar.searchQuery', '' );
		$('.searchField').focus();
	}
});