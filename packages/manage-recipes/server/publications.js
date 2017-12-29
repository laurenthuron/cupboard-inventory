if (Meteor.isServer) {
	Meteor.publish('Recipes', function () {
		const currentUserId = this.userId;
		if ( currentUserId ) {
			if (Roles.userIsInRole(currentUserId, ['admin', 'user'])) {
				return Recipes.find();
			} else {
				this.stop();
				return;
			}
		}
	});
}