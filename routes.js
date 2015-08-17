//ROUTES
Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

//home
Router.route('/', {
	template: 'home',
	name: 'home'
})

//register
Router.route('register', {
	name: 'register'
});

//login
Router.route('login', {
	name: 'login'
});

//profile
Router.route('me', {
	template: 'profile',

	onBeforeAction: function(){
		var currentUser = Meteor.userId();
		if(currentUser) {
			this.next();
		} else {
			this.render('login');
		}
	}
});

//add record
Router.route('add', {
	name: 'add'
});

//show record
Router.route('record/:_id', {
	template: 'recordPage',
	name: 'recordPage',
	data: function(){
		var currentRecord = this.params._id;
		return Records.findOne({_id: currentRecord});
	}
});

//show artist
Router.route('artist/:_id', {
	template: 'artistPage',
	name: 'artistPage',
	data: function(){
		var currentArtist = this.params._id;
		return Artists.findOne({_id: currentArtist});
	}
});