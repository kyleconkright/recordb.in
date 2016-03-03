//PUBLISH
Meteor.publish('artists', function(){
    var currentUser = this.userId;
    return Artists.find({createdBy: currentUser});
});

Meteor.publish('records', function(currentArtist){
    var currentUser = this.userId;
    return Records.find({createdBy: currentUser, artistId: currentArtist});
});

//METHODS
Meteor.methods({
    'sendVerificationLink': function() {
        var userId = Meteor.userId();
        if(userId) {
            return Accounts.sendVerificationEmail(userId);
        }
    },
    'createNewArtist': function(artistName){
        var currentUser = Meteor.userId();
        check(artistName, String);
        var data = {
            name: artistName,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Artists.insert(data);
    },
    'removeArtist': function(documentId) {
        var currentUser = Meteor.userId();
        var currentArtist = Artists.findOne(documentId);
        if(!currentUser) {
            throw new Meteor.Error("invalid-user", "You do not own that artist.")
        }
        Artists.remove({_id: documentId, createdBy: currentUser});
    },
    'createArtistItem': function(recordName, currentArtist) {
        check(recordName, String);
        check(currentArtist, String);

        var currentUser = Meteor.userId();
        var data = {
            name: recordName,
            completed: false,
            createdAt: new Date(),
            createdBy: currentUser,
            artistId: currentArtist
        }

        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }

        var currentArtist = Artists.findOne(currentArtist);
        if(currentArtist.createdBy != currentUser) {
            throw new Meteor.Error("invalid-user", "You don't own that artist.");
        }

        if(recordName !== '') {
            return Records.insert(data);
        }
    },
    'updateArtistItem': function(documentId, recordItem) {
        check(recordItem, String)
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged in.");
        }
        Records.update(data, {$set: {name: recordItem}});
    },
    'changeItemStatus': function(documentId, status) {
        check(status, Boolean);
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged in.");  
        }
        Records.update(data, {$set: {completed: status}});
    },
    'removeArtistItem': function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged in.");
        }
        Records.remove(data);
    }
});