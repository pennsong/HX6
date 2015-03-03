var mongoose = require('mongoose');

var MeetSchema = new mongoose.Schema({
    creater: {
        username: { type: String, required: true },
        nickname: String,
        specialPic: String
    },
    target: {
        username: String,
        nickname: String,
        specialPic: String
    },
    status : { type: String, enum: ['待确认', '待回复', '成功'], required: true },
    replyLeft : { type: Number, default: 2, required: true },
    mapLoc : {
        name : { type: String, required: true },
        address : { type: String, required: true },
        uid : { type: String, required: true }
    },
    personLoc : {
        type: [Number],
        required: true,
        index: '2dsphere'
    },
    specialInfo: {
        sex: { type: String, enum: ['男', '女'], required: true },
        hair  : { type: String, required: true },
        glasses : { type: String, required: true },
        clothesType : { type: String, required: true },
        clothesColor : { type: String, required: true },
        clothesStyle : { type: String, required: true }
    }
});

module.exports = MeetSchema;