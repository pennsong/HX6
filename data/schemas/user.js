var mongoose = require('mongoose');
var moment = require('moment');
var async = require("async");
var jwt = require('jwt-simple');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    token: { type: String, unique: true, sparse: true },
    cid: { type: String, unique: true, sparse: true},
    specialInfo: {
        sex: { type: String, enum: ['男', '女'], required: true },
        hair  : String,
        glasses : String,
        clothesType : String,
        clothesColor : String,
        clothesStyle : String
    },
    specialPic : String,
    specialInfoTime : Date,
    lastLocation : {
        type: [Number],
        index: '2dsphere'
    },
    lastLocationTime : Date,
    lastMeetCreateTime : Date,
    lastFakeTime : Date
});

UserSchema.statics.login = function(username, password, cid, callback){
    var tmpUser;
    var loginResult = {};
    var self = this;

    async.waterfall([
            function(next){
                //验证用户名密码
                self.findOne(
                    {
                        username: username,
                        password: password
                    },
                    next
                );
            },
            function(result, next){
                if (result == null) {
                    next({
                        err: '用户名或密码错误!'
                    }, null);
                }
                //用户名密码正确
                else {
                    tmpUser = result;
                    //清空同台设备绑定的其他用户
                    self.findOneAndUpdate(
                        {
                            cid: cid
                        },
                        {
                            $unset: { cid: 1 }
                        },
                        next
                    );
                }
            },
            function(result, next)
            {
                //更新cid和token
                var expires = moment().add(100, 'year').valueOf();
                var token = jwt.encode({
                        iss: tmpUser.id,
                        exp: expires
                    },
                    'ppToken'
                );
                self.update(
                    {
                        _id: tmpUser.id
                    },
                    {
                        $set:
                        {
                            token: token,
                            cid: cid
                        }
                    },
                    function (err, numberAffected, raw)
                    {
                        loginResult.token = token;
                        next(err, null);
                    }
                );
            },
            function(result, next)
            {
                //get meets
                tmpUser.getMeets(next);
            },
            function(result, next)
            {
                loginResult.meets = result;
                //get friends
                tmpUser.getFriends(next);

            },
            function(result, next)
            {
                loginResult.friends = result;
                next(null, loginResult);
            }
        ],
        callback
    );
}

UserSchema.methods.getMeets = function(callback) {
    return this.model('Meet')
        .find({
            $or: [
                {'creater.username': this.username},
                {'target.username': this.username}
            ],
            status: {$ne:"成功"}
        })
        .sort({'_id': 1})
        .exec(callback);
};

//发送meet检查
UserSchema.methods.sendMeetCheck = function() {
    return (this.specialInfoTime
        &&  this.specialInfoTime > moment(moment().format('YYYY-MM-DD')).valueOf()
        && this.lastLocationTime > moment().add(-5, 'm').valueOf()
        && this.lastMeetCreateTime < moment().add(-30, 's').valueOf()
        );
};

//找本人发送待回复的meet中的目标
UserSchema.methods.getMeetTargets = function(callback) {
    this.model('Meet')
        .find({
            'creater.username': this.username,
            status: "待回复"
        })
        .select('target.username')
        .exec(callback);
};

//找本人朋友
UserSchema.methods.getFriends = function(callback) {
    this.model('Friend')
        .find({
            $or: [
                {'creater.username': this.username},
                {'target.username': this.username}
            ]
        })
        .exec(callback);
};

//找符合条件的对象
UserSchema.methods.getTargets = function(sex, hair, glasses, clothesType, clothesColor, clothesStyle, callback) {
    this.model('User')
        .aggregate(
        [
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [ this.lastLocation[0], this.lastLocation[1] ] },
                    distanceField: "lastLocation",
                    maxDistance: 500,
                    query: {
                        specialInfoTime: {$gt: moment().add(-15, 'm').valueOf()},
                        "specialInfo.sex": sex,
                        username: {$ne: this.username}
                    },
                    spherical: true
                }
            },
            {
                $project:
                {
                    username: 1,
                    specialPic: 1,
                    score:
                    {
                        $add:
                            [
                                {
                                    $cond:
                                        [
                                            {
                                                $eq: [ "$specialInfo.hair", hair ]
                                            },
                                            1,
                                            0
                                        ]
                                },
                                {
                                    $cond:
                                        [
                                            {
                                                $eq: [ "$specialInfo.glasses", glasses ]
                                            },
                                            1,
                                            0
                                        ]
                                },
                                {
                                    $cond:
                                        [
                                            {
                                                $eq: [ "$specialInfo.clothesType", clothesType ]
                                            },
                                            1,
                                            0
                                        ]
                                },
                                {
                                    $cond:
                                        [
                                            {
                                                $eq: [ "$specialInfo.clothesColor", clothesColor ]
                                            },
                                            1,
                                            0
                                        ]
                                },
                                {
                                    $cond:
                                        [
                                            {
                                                $eq: [ "$specialInfo.clothesStyle", clothesStyle ]
                                            },
                                            1,
                                            0
                                        ]
                                }
                            ]
                    }
                }
            },
            {
                $match :
                {
                    score : { $gte : 4 }
                }
            }
        ]
    ).exec(callback);
};

//生成朋友
UserSchema.methods.createFriend = function(targetUsername, callback) {
    this.model('User').findOne(
        {
            username: targetUsername
        }
    ).exec(
        function(err, doc)
        {
            if (err)
            {
                callback(err, null);
            }
            else if (!doc)
            {
                callback({err: '没找到对应目标!'}, null);
            }
            else
            {
                this.model('Friend')
                    .create({
                        creater: {
                            username: this.username,
                            nickname: this.nickname
                        },
                        target: {
                            username: doc.username,
                            nickname: doc.nickname
                        }
                    }
                )
                    .exec(callback);
            }
        }
    );
};

//更新位置
UserSchema.methods.updateLocation = function(lng, lat, callback){
    this.lastLocation = [lng, lat];
    this.lastLocationTime = moment().valueOf();
    this.save(callback);
};

//创建meet不在其中
UserSchema.methods.createMeetNo = function(
    mapLocName,
    mapLocUid,
    mapLocAddress,
    sex,
    hair,
    glasses,
    clothesType,
    clothesColor,
    clothesStyle, callback){

    async.series({
            lastMeetCreateTime: function(callback)
            {
                //修改最后发送meet时间
                this.lastMeetCreateTime = moment().valueOf();
                this.save(callback);
            },
            meet: function(callback){
                //创建待确认meet
                this.model('Meet').create(
                    {
                        creater: {
                            username: this.username,
                            nickname: this.username,
                            specialPic: this.specialPic
                        },
                        status: '待确认',
                        replyLeft: 2,
                        mapLoc: {
                            name: mapLocName,
                            address: mapLocAddress,
                            uid: mapLocUid
                        },
                        personLoc: [this.lastLocation[0], this.lastLocation[1]],
                        specialInfo: {
                            sex: sex,
                            hair: hair,
                            glasses: glasses,
                            clothesType: clothesType,
                            clothesColor: clothesColor,
                            clothesStyle: clothesStyle
                        }
                    },
                    callback
                );
            }
        },
        callback
    );
};

UserSchema.methods.createOrConfirmClickFake = function(callback){
    //确定此用户是否是30s内有点击fake
    var tmpNow = moment().valueOf();
    if (this.lastFakeTime > moment(tmpNow).add(-30, 's').valueOf())
    {
        //如果是则把meet最后发送时间改为now
        this.lastMeetCreateTime = tmpNow;
    }
    this.lastFakeTime = tmpNow;
    this.save(callback);
};

//创建meet
UserSchema.methods.createMeet = function(mapLocName, mapLocUid, mapLocAddress, username, callback){
    async.waterfall([
            function(next)
            {
                //更新最近发送meet时间,清空最近选择fake时间
                this.lastMeetCreateTime = moment().valueOf();
                this.lastFakeTime = undefined;
                this.save(next);
            },
            function(result, next)
            {
                //查找target
                this.model('User').findOne({username: username}, next);
            },
            function(result, next){
                if (result == null)
                {
                    next({err: '没有找到对应目标!'}, null);
                }
                else
                {
                    //创建meet
                    this.model('Meet').create(
                        {
                            creater: {
                                username: this.username,
                                nickname: this.username,
                                specialPic: this.specialPic
                            },
                            target: {
                                username: result.username,
                                nickname: result.username,
                                specialPic: result.specialPic
                            },
                            status: '待确认',
                            replyLeft: 2,
                            mapLoc: {
                                name: mapLocName,
                                address: mapLocAddress,
                                uid: mapLocUid
                            },
                            personLoc: [this.lastLocation[0], this.lastLocation[1]],
                            specialInfo: {
                                sex: result.specialInfo.sex,
                                hair: result.specialInfo.hair,
                                glasses: result.specialInfo.glasses,
                                clothesType: result.specialInfo.clothesType,
                                clothesColor: result.specialInfo.clothesColor,
                                clothesStyle: result.specialInfo.clothesStyle
                            }
                        },
                        next
                    );
                }
            }
        ],
        callback
    );
};

//确认meet
UserSchema.methods.confirmMeet = function(username, meetId, callback){
    async.waterfall([
            function(next)
            {
                //清空最近选择fake时间
                this.lastFakeTime = undefined;
                this.save(next);
            },
            function(result, next)
            {
                //查找target
                this.model('User').findOne({username: username}, next);
            },
            function(result, next){
                if (result == null)
                {
                    next({err: '没有找到对应目标!'}, null);
                }
                else
                {
                    //更新meet target
                    this.model('Meet').findOneAndUpdate(
                        {
                            _id: meetId
                        },
                        {
                            $set:{
                                target: {
                                    username: result.username,
                                    nickname: result.username,
                                    specialPic: result.specialPic
                                }
                            }
                        },
                        next
                    );
                }
            }
        ],
        callback
    );
};

//确认互发meet
UserSchema.methods.confirmEachOtherMeet = function(username, meetId, anotherMeet, callback){

};

//回复meet点击真人
UserSchema.methods.replyMeetClickTarget = function(username, meetId, callback){
    var self = this;

    async.waterfall([
            function(next)
            {
                //清空最近选择fake时间
                this.lastFakeTime = undefined;
                this.save(next);
            },
            function(result, next)
            {
                this.model('Meet').findOneAndUpdate(
                    {
                        _id: meetId,
                        'target.username': self.username,
                        status: '待回复'
                    },
                    {
                        $set:{
                            status: '成功'
                        }
                    },
                    next);
            },
            //己方meet添加target并修改状态为'成功'
            function(result, next){
                if (result == null)
                {
                    next({err: '没有找到对应目标!'}, null);
                }
                //生成朋友
                else
                {
                    self.createFriend(username, next);
                }
            }
        ],
        callback
    );
};


module.exports = UserSchema;