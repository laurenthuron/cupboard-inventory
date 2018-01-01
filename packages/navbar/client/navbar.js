Template.navigationBar.helpers({
	navElements: function () {
		return utils.navbar;
	}
});

Template.navigationBar.events({
	"click .navbar-collapse a" ( event, template ) {
		$(".navbar-collapse").collapse('hide');
	}
});