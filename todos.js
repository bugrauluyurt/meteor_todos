Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  // Template helpers
  Template.main.helpers({
    todos: function () {
      return Todos.find({}, {sort: {createdAt: -1}});
    }
  });

  // Events
  Template.main.events({
    "submit .new-todo": function(event) {
      var text = event.target.text.value;
      
      Meteor.call('addTodo', text);

      // Clear Form
      event.target.text.value = '';

      // Prevent Submit
      return false;
    },

    "click .toggle-checked": function(){
      Meteor.call('setChecked', this._id, !this.checked);
    },

    "click .delete-todo": function(){
      if (confirm('Are You Sure')) {
        Meteor.call('deleteTodo', this._id);
      }; 
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY' //  One of 'USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', or 'EMAIL_ONLY' (default).
  });
}

// Methods should be created after removing insecure package.
// Methods are similar to above written events.
// After completing the methods section you should change the events by below mentioned methods.
// Below mentioned methods should be called above in the events section by Meteor.call()
Meteor.methods({
  addTodo: function(text){
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Todos.insert({
        text: text,
        createdAt: new Date(),
        userID: Meteor.userId(),
        username: Meteor.user().username
    });
  },
  deleteTodo: function(todoId){
    Todos.remove(todoId);
  },
  setChecked: function(todoID, setChecked){
    Todos.update(todoID, {$set:{checked: setChecked}});
  } 
});

if (Meteor.isServer) {
  
}
