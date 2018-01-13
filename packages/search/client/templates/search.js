Template.searchBar.onCreated( () => {
	let template = Template.instance();

	Session.set('searchBar.searchQuery', '');
	Session.set('searchBar.searching', false);
	// reactive subscription on the search template
	// takes a query and a page name. Both are saved on session, making them reactive
	template.autorun( () => {
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
		// Search bar placeholder
		return Session.get('general.currentPage');
	}
});

Template.search.helpers({
	searching: function () {
		// links the searchBar template search entry and the autorun searching template trigger
		return Session.get('searchBar.searching');
	},
	query: function () {
		// links the searchBar template search query to the autorun search subscription on the search template
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
		// this way of doing the search needs changing
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
		// not really a search button, more like a reset button in function
		event.preventDefault();
		$('.searchField').val(''); // clear the search field value.
		Session.set( 'searchBar.searchQuery', '' ); // reset the corresponding session
		$('.searchField').focus(); // refocus on the search input since we clicked out of it
	}
});