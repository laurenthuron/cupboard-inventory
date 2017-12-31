Router.configure({
	layoutTemplate:'ApplicationLayout'
});

AccountsTemplates.configure({
	defaultLayout: 'ApplicationLayout',
	enablePasswordChange: true,
	showForgotPasswordLink: true,
	overrideLoginErrors: true,
	sendVerificationEmail: false,
	confirmPassword: false,
	negativeValidation: true,
	positiveValidation:true,
	negativeFeedback: false,
	positiveFeedback:false
});

AccountsTemplates.addField({
	_id: 'firstName',
	type: 'text',
	displayName: "First name",
	required: true
});

AccountsTemplates.addField({
	_id: 'lastName',
	type: 'text',
	displayName: "Last name",
	required: true
});

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('verifyEmail');
AccountsTemplates.configureRoute('resendVerificationEmail');
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');

// ensure signing for all routes except the ones below
var exceptions = ['/',
	'signIn',
	'signOut',
	'SignUp',
	'forgotPassword',
	'verificationPending',
	'resetPassword',
	'enrollAccount'];
Router.onBeforeAction(function () {
	// all properties available in the route function
	// are also available here such as this.params
	
	if (!Meteor.userId()) {
		// if the user is not logged in, render the Login template
		Router.go("/sign-up");
		this.next();
	} else {
		// otherwise don't hold up the rest of hooks or our route/action function
		// from running
		this.next();
	}
}, {
	except: exceptions
});

Router.route('home', function () {
	if (!this.ready()) {
		this.render('loading');
	} else {
		this.render('home', {
			to: "main"
		});
	}
});

Router.route('/(.*)', function () {//regex for every route, must be last
	if (this.ready()) {
		this.redirect("home");
	} else
		this.render('loading');
});