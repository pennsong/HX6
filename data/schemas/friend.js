var mongoose = require('mongoose');

var FriendSchema = mongoose.Schema({
    users: [{
        username: { type: String, required: true },
        nickname: { type: String, required: true },
        unread: { type: Boolean }
    }],
    friendUsername: { type: String },
    friendNickname: { type: String },
    unread: {type: Boolean}

});

module.exports = FriendSchema;