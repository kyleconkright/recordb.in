////////////////
//   ROUTES   //
////////////////
Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/register');

Router.route('/login');

Router.route('/verify-email/:token', {
    name: 'verify-email',
    action(params) {
        Accounts.verifyEmail(this.params.token, function(error) {
            if(error) {
                console.log(error)
            } else {
                Router.go('/');
                Bert.alert('Thanks for verifying!', 'info', 'growl-top-right');
            }
        })
    } 
});

Router.route('/artist/:_id', {
    name: 'artistPage',
    template: 'artistPage',
    data: function(){
        var currentArtist = this.params._id;
        var currentUser = Meteor.userId();
        return Artists.findOne({ _id: currentArtist, createdBy: currentUser });
    },
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.render("login");
        }
    },
    waitOn: function(){
        var currentArtist = this.params._id;
        return Meteor.subscribe('records', currentArtist);
    }
});