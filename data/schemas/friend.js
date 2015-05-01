var mongoose = require('mongoose');

var FriendSchema = mongoose.Schema({
    users: [{
        username: { type: String, required: true },
        nickname: { type: String, required: true },
        unread: { type: Boolean }
    }],
    messages : [{
        //username
        from : { type: String, required: true },
        //username
        to : { type: String, required: true },
        content: { type: String, required: true },
        time: { type: Date, required: true }
    }]

});

module.exports = FriendSchema;