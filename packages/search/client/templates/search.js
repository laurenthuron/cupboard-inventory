Template.searchBar.onCreated( () => {
	let template = Template.instance();

	Session.set('searchBar.searchQuery', '');
	Session.set('searchBar.searching', false);
	
	template.autorun( () => {
		console.log(Session.get('searchBar.searchQuery'))
		template.subscribe( 'search',
				Session.get( 'searchBar.searchQuery' ),
				(Session.get('general.currentPage')),
				() => {
					setTimeout( () => {
						Session.set( 'searchBar.searching', false );
					}, 300 );
		});
	});
});

Template.search.onDestroyed( function () {
	// cleanup anything in the search bar and the session query.
	$('.searchField').val('');
	Session.set( 'searchBar.searchQuery', '' );
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
		// The currentPage session informs the search from which page it was queried - i.e. items, recipes page etc
		let searchDbString = Session.get('general.currentPage');
		// If the search came from the home page it is then a global search, set the current page to "_searchAll"
		if (utils.validURL(Session.get("general.previousLocationPath")) ||
				Session.get("general.previousLocationPath") === "/home") {
			Session.set("general.currentPage", "_searchAll");
			
			let cursors = []; // we will save the returned cursors within an array
			
			// iterate through all registered plugin databases and return the result as a fetch() array.
			for ( let db in utils.pluginDb ) {
				cursors.push( utils.pluginDb[db].find().fetch() );
			}
			// finally concatenate all arrays within cursors into a single one. The template will take care to
			// differenciate between the results.
			return [].concat.apply([], cursors);
		} else {
			// If we're on a plugin page, just return the query from the plugin's corresponding database
			return utils.pluginDb[searchDbString].find();
		}
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