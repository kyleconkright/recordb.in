//SUBSCRIPTIONS
Meteor.subscribe('artists');

Template.artists.onCreated(function(){
    this.subscribe('artists');
});

//HELPERS
Template.artists.helpers({
    'artist': function(){
        var currentUser = Meteor.userId();
        return Artists.find({createdBy: currentUser}, {sort: {name: 1}});
    }
});

Template.records.helpers({
	'record': function() {
        var currentArtist = this._id;
        var currentUser = Meteor.userId();
		return Records.find({artistId: currentArtist, createdBy: currentUser}, {sort: {createdAt: -1}});
	}
});

Template.recordItem.helpers({
    'checked': function() {
        var isCompleted = this.completed;
        if(isCompleted) {
            return "checked";
        } else {
            return "";
        }
    }
});







//EVENTS
Template.verify.events({
    'click .resend-verification-link' (event) {
        Meteor.call('sendVerificationLink', (error, response) => {
            if(error) {
                Bert.alert(error.reason, 'danger', 'growl-top-right');
            } else {
                let email = Meteor.user().emails[0].address;
                Bert.alert('Email sent to ' + email, 'info', 'growl-top-right');
            }
        })
    }
});

Template.addArtist.events({
    'submit form': function(event){
        event.preventDefault();
        var artistName = $('[name=artistName]').val();
        Meteor.call('createNewArtist', artistName, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                Router.go('artistPage', { _id: results });
                $('[name=artistName]').val('');
            }
        });
    }
});

Template.addRecord.events({
	'submit form': function(event) {
		event.preventDefault();
        var recordName = event.target.recordName.value;
        var currentArtist = this._id;
        Meteor.call('createArtistItem', recordName, currentArtist, function(error, results){
            if(error) {
                console.log(error.reason)
            } else {
                event.target.recordName.value = '';
            }
        });
	}
});

Template.recordItem.events({
	'click .delete-record': function(event) {
		event.preventDefault();
        var documentId = this._id;
		var confirm = window.confirm('delete?');
		if(confirm) {
            Meteor.call('removeArtistItem', documentId);
		}
	},
    'keyup input[name="recordItem"]': function(event) {
        if(event.which == 13 || event.which == 27) {
            $(event.target).blur();
        } else {
            var documentId = this._id;
            var recordItem = event.target.value;
            Meteor.call('updateArtistItem', documentId, recordItem);
        }
    },
    'click div.checkbox': function(event) {
        var documentId = this._id;
        var isCompleted = this.completed;
        if(isCompleted) {
            Meteor.call('changeItemStatus', documentId, false)
        } else {
            Meteor.call('changeItemStatus', documentId, true)
        }
    }
});



// $.validator.setDefaults({
//     rules: {
//         email: {
//             required: true,
//             email: true
//         },
//         password: {
//             required: true,
//             minlength: 6
//         }
//     },
//     messages: {
//         email: {
//             required: "You must enter an email address",
//             email: "That email address is invalid"
//         },
//         password: {
//             required: "You must enter a password",
//             minlength: "Your password must be at least {0} characters"
//         }
//     }
// });

Template.register.events({
    'submit .register' (event) {
        event.preventDefault();
        let email = $('input[type=email]').val();
        let password = $('input[type=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        }, function(error) {
            if(error) {
                if(error.reason == "Email already exists.") {
                    Bert.alert(error.reason, 'danger', 'growl-top-right' );
                }
            } else {
                Meteor.call('sendVerificationLink', function(error, response) {
                    if(error) {
                        Bert.alert(error.reason, 'danger', 'growl-top-right' );

                    } else {
                        Router.go('home');
                    }
                });
            }
        });
    }
});

// Template.login.onRendered(function(){
//     var validator = $('.login').validate({
//         submitHandler: function(event){
//             var email = $('[name=email]').val();
//             var password = $('[name=password]').val();
//             Meteor.loginWithPassword(email, password, function(error){
//                 if(error) {
//                     Bert.alert('Incorrect Email or Password', 'danger', 'growl-top-right');
//                     validator.showErrors({
//                         // email: "Email or Password Incorrect" 
//                     });
//                 } else {
//                     var currentRoute = Router.current().route.getName();
//                     if(currentRoute == "login") {
//                         Router.go('home'); 
//                     }
//                 }
//             });
//         }
//     });
// });

Template.login.events({
    'submit .login' (event) {
        event.preventDefault();
        
        let email = $('[name=email]').val();
        let password = $('[name=password]').val();

        Meteor.loginWithPassword(email, password, (error) => {
            if(error) {
                Bert.alert(error.reason, 'danger', 'growl-top-right');
            } else {
                let currentRoute = Router.current().route.getName();
                if(currentRoute == 'login') {
                    Router.go('home');
                    Bert.alert('Welcome Back!', 'info', 'growl-top-right');
                }
            }
        });

        

    }
});


    // var validator = $('.login').validate({
    //     submitHandler: function(event){
    //         var email = $('[name=email]').val();
    //         var password = $('[name=password]').val();
    //         Meteor.loginWithPassword(email, password, function(error){
    //             if(error) {
    //                 Bert.alert('Incorrect Email or Password', 'danger', 'growl-top-right');
    //                 validator.showErrors({
    //                     // email: "Email or Password Incorrect" 
    //                 });
    //             } else {
    //                 var currentRoute = Router.current().route.getName();
    //                 if(currentRoute == "login") {
    //                     Router.go('home'); 
    //                 }
    //             }
    //         });
    //     }
    // });



Template.navigation.events({
    'click .logout': function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('home');
    }
});


