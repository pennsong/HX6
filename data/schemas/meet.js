var mongoose = require('mongoose');

var MeetSchema = new mongoose.Schema({
    creater: {
        username: { type: String, required: true },
        nickname: String,
        specialPic: String,
        unread: Boolean
    },
    target: {
        username: String,
        nickname: String,
        specialPic: String,
        unread: Boolean
    },
    status : { type: String, enum: ['待确认', '待回复', '成功'], required: true },
    replyLeft : { type: Number, default: 2, required: true },
    mapLoc : {
        name : { type: String, required: true },
        address : { type: String },
        uid : { type: String, required: true }
    },
    personLoc : {
        type: [Number],
        required: true,
        index: '2dsphere'
    },
    specialInfo: {
        sex: { type: String, enum: ['男', '女']},
        hair  : { type: String },
        glasses : { type: String },
        clothesType : { type: String },
        clothesColor : { type: String },
        clothesStyle : { type: String }
    }
});

module.exports = MeetSchema;