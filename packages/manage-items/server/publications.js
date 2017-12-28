if (Meteor.isServer) {
	Meteor.publish('Inventory', function () {
		const currentUserId = this.userId;
		if ( currentUserId ) {
			if (Roles.userIsInRole(currentUserId, ['admin', 'user'])) {
				return Inventory.find();
			} else {
				this.stop();
				return;
			}
		}
	});
}