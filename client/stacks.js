// // // // // // // // 
// CLIENT JAVASCRIPT // 
// // // // // // // // 


//register template events
Template.register.onRendered(function(){
    var validator = $('form.register').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Accounts.createUser({
                email: email,
                password: password
            }, function(error){
                if(error){
                    if(error.reason == "Email already exists."){
                        validator.showErrors({
                            email: "That email already belongs to a registered user."   
                        });
                    }
                } else {
                    Router.go('home');
                }
            });
        }    
    });
});

//login template events
Template.login.onRendered(function(){
	var validator = $('form.login').validate({
		submitHandler: function(event){
			var email = $('[name=email]').val();
	        var password = $('[name=password]').val();
	        Meteor.loginWithPassword(email, password, function(error){
	        	if(error) {
	        		if(error.reason == "User not found"){
        		        validator.showErrors({
        		            email: error.reason    
        		        });
        		    }
        		    if(error.reason == "Incorrect password"){
        		        validator.showErrors({
        		            password: error.reason    
        		        });
        		    }
	        	} else {
	        		var currentRoute = Router.current().route.getName();
	        		if(currentRoute == 'login') {
	        			Router.go('home');
	        		}
	        	}
	        });
		}
	});
});

//validator defaults
$.validator.setDefaults({
	rules: {
		password: {
			minlength: 8,
			required: true
		},
		email: {
			email: true,
			required: true
		}
	}	
});


//profile
Template.profile.helpers({
	'user': function(){
		var currentUser = Meteor.userId();
		return Meteor.users.findOne({_id: currentUser});
	}
});

Template.profile.events({
	'click .delete': function(e){
		e.preventDefault();
		var currentUser = Meteor.userId();
		Meteor.users.remove({_id: currentUser});
	}
});


//add record
Template.add.events({
	'submit form.add': function(e) {
		e.preventDefault();
		
		var artistName = $('[name=artist]').val();
		
		if(Artists.findOne({name: artistName})) {
			var artist = Artists.findOne({name: artistName});
		} else {
			Artists.insert({name: artistName});
			var artist = Artists.findOne({name: artistName});
		}
		
		var title = $('[name=title]').val();
		var owner = Meteor.userId();
		
		Records.insert({
			artist: artist,
			title: title,
			owner: owner,
			createdAt: new Date()
		}, function(error){
			if(error) {
				console.log(error)
			} else {
				Router.go('home');
			}
		});
	}
});

//navigation template events
Template.navigation.events({
	'click .logout': function(e){
		e.preventDefault();
		Meteor.logout();
		Router.go('login');
	}
});

//Template.home.helpers
Template.home.helpers({
	'record': function(){
		return Records.find({}, {sort: {createdAt: -1}});
	}
});


Template.recordThumb.helpers({
	'artistRoute': function(){
		var currentRoute = Router.current().route.getName();
		if(currentRoute === 'artistPage') {
			return true;
		} else {
			return false;
		}
	}
});



//Template.artistPage.helpers
Template.artistPage.helpers({
	'record': function(){
		var currentArtist = this._id;
		return Records.find({'artist._id': currentArtist}, {sort: {createdAt: -1}});
	}
});

//Record Page Helper
Template.recordPage.helpers({
	'record': function(){
		var currentArtist = this.artist._id;
		return Artists.findOne({_id: currentArtist});
	}
});