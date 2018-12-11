var express = require('express');
var Period = require('../model/userModel');
var router = express.Router();
// [{
//     id: '/#12poiajdspfoif',
//     name: 'Andrew',
//     room: 'The Office Fans'
//   }]
  
  // addUser(id, name, room)
  // removeUser(id)
  // getUser(id)
  // getUserList(room)
  
  class Users {
    constructor () {
      this.users = [];
    }

    addUser (id, name, room) {
      var user = {id, name, room};
      this.users.push(user);
      return user;
    }

    removeUser (id) {
      var user = this.getUser(id);
  
      if (user) {
        this.users = this.users.filter((user) => user.id !== id);
      }
  
      return user;
    }

    getUser (id) {
      return this.users.filter((user) => user.id === id)[0]
    }

    getUserList (room) {
      var users = this.users.filter((user) => user.room === room);
      var namesArray = users.map((user) => {return {name: user.name, room: user.room}});  
      return namesArray;
    }

  }
  
  module.exports = {Users};