var assert = require("assert");
var should = require('should');
var User = require('../data/models/user');
var request = require('request');
var serverRoot = 'http://localhost:3000/';
var moment = require('moment');

var oriPoint = [121.59494756732285, 31.20953894223199];
var farPoint = [125.32235400000002, 43.88693199999999];
var testStartTime = moment();

var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

process.on('SIGINT', function() {
    db.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

describe('注册用户', function(){
    before(function(done){
        mongoose.connect('mongodb://localhost/HX6');
        db.once('open', function(){
            //初始化用户
            var userArray = [
                {
                    username: '1',
                    password: '123',
                    nickname: '1nickname',
                    //token: ,
                    cid: '1cid',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : '1.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'x',
                    password: '123',
                    nickname: 'xnickname',
                    token: 'xt',
                    cid: 'xcid',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'x.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'y',
                    password: '123',
                    nickname: 'ynickname',
                    token: 'yt',
                    cid: 'ycid',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'x.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-6, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : Date
                }
            ];

            var friendArray = [
                {
                    creater: {
                        username: '1',
                        nickname: '1nickname'
                    },
                    target: {
                        username: 'x',
                        nickname: 'xnickname'
                    },
                    messages : []
                }
            ];

            var meetArray = [
                {
                    creater: {
                        username: '1',
                        nickname: '1nickname',
                        specialPic: '1.jpg'
                    },
                    target: {
                        username: 'y',
                        nickname: 'ynickname',
                        specialPic: 'y.jpg'
                    },
                    status : '待回复',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: { type: String, enum: ['男', '女'], required: true },
                        hair  : { type: String, required: true },
                        glasses : { type: String, required: true },
                        clothesType : { type: String, required: true },
                        clothesColor : { type: String, required: true },
                        clothesStyle : { type: String, required: true }
                    }
                }
            ];

            User.remove(
                function(err){
                    if (!err)
                    {
                        User.create(userArray, done);
                    }
                }
            );
        });
    });

    after(function(done){
        db.close(done);
    });

    describe('正确新加用户', function(){
        it('应该保存成功并登陆', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'z',
                        password: 'b',
                        nickname: 'bn',
                        token: 'bt',
                        cid: 'testCid',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(200);
                    res.token.should.exist;
                    done(err);
                }
            );
        })
    })
})