Package.describe({
  name: 'laurenth:pdf-support',
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
	pdfkit: '0.8.3',
	moment: '2.17.0',
	"aws-sdk": '2.176.0',
	nodemailer: '4.3.1',
	"nodemailer-mailgun-transport": '1.3.5'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.0.1');
  api.use('ecmascript');
	api.use(['templating', 'iron:router'], ['client', 'server']);
	
  api.addFiles([
      'client/pdfSupport.html',
      'client/pdfSupport.js'
  ], 'client');
  
  api.addFiles([
      'server/createPDF.js'
  ], 'server');
});
