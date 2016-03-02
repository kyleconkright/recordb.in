//SUBSCRIPTIONS
Meteor.subscribe('lists');

Template.lists.onCreated(function(){
    this.subscribe('lists');
});

//HELPERS
Template.lists.helpers({
    'list': function(){
        var currentUser = Meteor.userId();
        return Lists.find({createdBy: currentUser}, {sort: {name: 1}});
    }
});

Template.todos.helpers({
	'todo': function() {
        var currentList = this._id;
        var currentUser = Meteor.userId();
		return Todos.find({listId: currentList, createdBy: currentUser}, {sort: {createdAt: -1}});
	}
});

Template.todoItem.helpers({
    'checked': function() {
        var isCompleted = this.completed;
        if(isCompleted) {
            return "checked";
        } else {
            return "";
        }
    }
});

Template.todosCount.helpers({
    'totalTodos': function() {
        var currentList = this._id;
        return Todos.find({listId: currentList}).count();
    },
    'completedTodos': function() {
        var currentList = this._id;
        return Todos.find({listId: currentList, completed: true}).count();
    }
});





//EVENTS
Template.addList.events({
    'submit form': function(event){
        event.preventDefault();
        var listName = $('[name=listName]').val();
        Meteor.call('createNewList', listName, function(error, results){
            if(error){
                console.log(error.reason);
            } else {
                Router.go('listPage', { _id: results });
                $('[name=listName]').val('');
            }
        });
    }
});

Template.addTodo.events({
	'submit form': function(event) {
		event.preventDefault();
        var todoName = event.target.todoName.value;
        var currentList = this._id;
        Meteor.call('createListItem', todoName, currentList, function(error, results){
            if(error) {
                console.log(error.reason)
            } else {
                event.target.todoName.value = '';
            }
        });
	}
});

Template.todoItem.events({
	'click .delete-todo': function(event) {
		event.preventDefault();
        var documentId = this._id;
		var confirm = window.confirm('delete?');
		if(confirm) {
            Meteor.call('removeListItem', documentId);
		}
	},
    'keyup input[name="todoItem"]': function(event) {
        if(event.which == 13 || event.which == 27) {
            $(event.target).blur();
        } else {
            var documentId = this._id;
            var todoItem = event.target.value;
            Meteor.call('updateListItem', documentId, todoItem);
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



$.validator.setDefaults({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        email: {
            required: "You must enter an email address",
            email: "That email address is invalid"
        },
        password: {
            required: "You must enter a password",
            minlength: "Your password must be at least {0} characters"
        }
    }
});

Template.register.onRendered(function() {
    var validator = $('.register').validate({
        submitHandler: function(){
            var email = $('input[type=email]').val();
            var password = $('input[type=password]').val();
            Accounts.createUser({
                email: email,
                password: password
            }, function(error) {
                if(error) {
                    if(error.reason == "Email already exists.") {
                        validator.showErrors({
                            email: "That email is already registered"
                            // Bert.alert( 'That email is already registered', 'danger' );
                        });
                    }
                } else {
                    // Router.go('home');
                    Meteor.call('sendVerificationLink', function(error, response) {
                        if(error) {
                            console.log(error.reason);
                            console.log('Meteor call not working');
                            Bert.alert(error.reason, 'danger', 'growl-top-right' );

                        } else {
                            Bert.alert('success');
                            Router.go('home');
                        }
                    });
                }
            });
        }
    });
});

Template.login.onRendered(function(){
    var validator = $('.login').validate({
        submitHandler: function(event){
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();
            Meteor.loginWithPassword(email, password, function(error){
                if(error) {
                    validator.showErrors({
                        email: "Email or Password Incorrect" 
                    });
                } else {
                    var currentRoute = Router.current().route.getName();
                    if(currentRoute == "login") {
                        Router.go('home'); 
                    }
                }
            });
        }
    });
});


Template.navigation.events({
    'click .logout': function(event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('home');
    }
});


