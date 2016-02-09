
//PUBLISH
Meteor.publish('lists', function(){
    var currentUser = this.userId;
    return Lists.find({createdBy: currentUser});
});

Meteor.publish('todos', function(currentList){
    var currentUser = this.userId;
    return Todos.find({createdBy: currentUser, listId: currentList});
});

//METHODS
Meteor.methods({
    'createNewList': function(listName){
        var currentUser = Meteor.userId();
        check(listName, String);
        var data = {
            name: listName,
            createdBy: currentUser
        }
        if(!currentUser){
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }
        return Lists.insert(data);
    },
    'removeList': function(documentId) {
        var currentUser = Meteor.userId();
        var currentList = Lists.findOne(documentId);
        if(!currentUser) {
            throw new Meteor.Error("invalid-user", "You do not own that list.")
        }
        Lists.remove({_id: documentId, createdBy: currentUser});
    },
    'createListItem': function(todoName, currentList) {
        check(todoName, String);
        check(currentList, String);

        var currentUser = Meteor.userId();
        var data = {
            name: todoName,
            completed: false,
            createdAt: new Date(),
            createdBy: currentUser,
            listId: currentList
        }

        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged-in.");
        }

        var currentList = Lists.findOne(currentList);
        if(currentList.createdBy != currentUser) {
            throw new Meteor.Error("invalid-user", "You don't own that list.");
        }

        if(todoName !== '') {
            return Todos.insert(data);
        }
    },
    'updateListItem': function(documentId, todoItem) {
        check(todoItem, String)
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged in.");
        }
        Todos.update(data, {$set: {name: todoItem}});
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
        Todos.update(data, {$set: {completed: status}});
    },
    'removeListItem': function(documentId) {
        var currentUser = Meteor.userId();
        var data = {
            _id: documentId,
            createdBy: currentUser
        }
        if(!currentUser) {
            throw new Meteor.Error("not-logged-in", "You're not logged in.");
        }
        Todos.remove(data);
    }
});