Package.describe({
  name: 'laurenth:manage-items',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.0.1');
  api.use('ecmascript');
  api.use('mongo');
  api.use('underscore');
  api.use('ongoworks:security');
  
  api.use('aldeed:collection2-core');
	api.use('aldeed:autoform@6.0.0');
  
  api.use(['templating', 'iron:router', 'alexwine:bootstrap-4', 'session'], 'client');
  
  api.addFiles([
  		'both/startup.js',
      'both/collections.js'
  ]);
  
  api.addFiles([
  	'client/addItem.html',
		'client/manageItems.html',
		'client/listItems.html',
		'client/editItem.html',
		'client/addItem.js',
		'client/manageItems.js',
		'client/listItems.js',
		'client/editItem.js',
		'client/routes.js'
  ], 'client');
  
  api.addFiles([
      'server/manageItemsMethods.js',
      'server/publications.js'
  ], 'server');
  
  api.export(['Inventory'], ['client', 'server']);
});
