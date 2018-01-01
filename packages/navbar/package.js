Package.describe({
  name: 'laurenth:navbar',
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
	
	api.use(['templating', 'iron:router', 'alexwine:bootstrap-4', 'session'], 'client');
  
  api.addFiles([
    'client/navbar.html',
    'client/navbar.js'
  ], 'client');
});