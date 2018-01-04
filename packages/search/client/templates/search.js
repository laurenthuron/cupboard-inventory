Template.navSearch.onCreated( () => {
	let template = Template.instance();

	Session.set('navbar.searchQuery', '');
	Session.set('navbar.searching', false);
	
	template.autorun( () => {
		console.log(Session.get('navbar.searchQuery'))
		template.subscribe( 'InventorySearch', Session.get( 'navbar.searchQuery' ), () => {
			setTimeout( () => {
				Session.set( 'navbar.searching', false );
			}, 300 );
		});
	});
});

Template.search.helpers({
	searching() {
		return Session.get('navbar.searching');
	},
	query() {
		return Session.get('navbar.searchQuery');
	},
	inventory() {
		let inventory = Inventory.find();
		if ( inventory ) {
			return inventory;
		}
	},
	isFavorite: function (bool) {
		return (bool) ? 'glyphicon-star' : 'glyphicon-star-empty';
	},
	inStock: function (stockLevel) {
		if ( stockLevel > 0 ) {
			return `In stock: ${stockLevel}`;
		} else {
			return `Out of stock`;
		}
	}
});

Template.navSearch.events({
	'click .searchField' ( event, template ) {
		Router.go("search");
	},
	'keyup .searchField' ( event, template ) {
		console.log(Session.get('navbar.searchQuery'));
		let value = event.target.value.trim();
		
		if ( value !== '' && event.keyCode !== 13 ) {
			Session.set( 'navbar.searchQuery', value );
			Session.set( 'navbar.searching', true );
		}
		
		if ( value === '' ) {
			Session.set( 'navbar.searchQuery', value );
		}
	}
});