var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
    //username
    from : { type: String, required: true },
    //username
    to : { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, required: true },
    unread: {type: Boolean, required: true}
});

module.exports = MessageSchema;