Package.describe({
  name: 'laurenth:search',
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
  
  api.use(['templating', 'iron:router', "reactive-var", 'session'], "client");
  
  api.addFiles([
      'common/startup.js'
  ], ['client', 'server']);
  
  api.addFiles([
      'client/templates/search.html',
      'client/templates/search.js',
      'client/routes.js'
  ], "client");
  
  api.addFiles([
     'server/publications/search.js'
  ], "server");
  
});
