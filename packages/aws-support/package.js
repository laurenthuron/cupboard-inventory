Package.describe({
  name: 'laurenth:aws-support',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
	"aws-sdk": '2.176.0'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.0.1');
  api.use('ecmascript');
	api.use('underscore');
	api.use('mongo');
  api.use('templating', 'iron:router', 'session', 'client');
  
  api.addFiles([
    'client/uploadFile.hmtl',
    'client/uploadFile.js',
  ], 'client');
  
});

