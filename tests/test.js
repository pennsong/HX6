var assert = require("assert");
var should = require('should');
var User = require('../data/models/user');
var Friend = require('../data/models/friend');
var Meet = require('../data/models/meet');
var request = require('request');
var serverRoot = 'http://localhost:3000/';
var moment = require('moment');
var async = require("async");

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

describe('API测试', function(){
    beforeEach(function(done){
        //console.log('reset.........................................');
        mongoose.connect('mongodb://localhost/HX6');
        db.once('open', function(){
            //初始化用户
            var userArray = [
                {
                    username: '1',
                    password: '123',
                    nickname: '1nickname',
                    //token: null,
                    cid: '1c',
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
                    username: 'a',
                    password: '123',
                    nickname: 'anickname',
                    token: 'at',
                    cid: 'ac',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'a.jpg',
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
                    cid: 'xc',
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
                    cid: 'yc',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'y.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-6, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'z',
                    password: '123',
                    nickname: 'znickname',
                    token: 'zt',
                    cid: 'zc',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'z.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-1, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'c',
                    password: '123',
                    nickname: 'cnickname',
                    token: 'ct',
                    cid: 'cc',
                    specialInfo: {
                        sex: '女',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'c.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'd',
                    password: '123',
                    nickname: 'dnickname',
                    //token: 'dt',
                    cid: 'dc',
                    specialInfo: {
                        sex: '女'
                    },
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf()
                },
                {
                    username: 'e',
                    password: '123',
                    nickname: 'enickname',
                    //token: 'et',
                    cid: 'ec',
                    specialInfo: {
                        sex: '女',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'e.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(-1, 'm').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf()
                    //lastMeetCreateTime : testStartTime.add(-1, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'f',
                    password: '123',
                    nickname: 'fnickname',
                    token: 'ft',
                    cid: 'fc',
                    specialInfo: {
                        sex: '女'
                    },
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf()
                },
                {
                    username: 'g',
                    password: '123',
                    nickname: 'gnickname',
                    token: 'gt',
                    cid: 'gc',
                    specialInfo: {
                        sex: '女'
                    },
                    lastLocation : farPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf()
                },
                {
                    username: 'h',
                    password: '123',
                    nickname: 'hnickname',
                    token: 'ht',
                    cid: 'hc',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'h.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : farPoint,
                    lastLocationTime : testStartTime.add(-6, 'm').valueOf()
                },
                {
                    username: 'i',
                    password: '123',
                    nickname: 'inickname',
                    token: 'it',
                    cid: 'ic',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'i.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf(),
                    lastFakeTime : testStartTime.add(-1, 's').valueOf()
                },
                {
                    username: 'j',
                    password: '123',
                    nickname: 'jnickname',
                    token: 'jt',
                    cid: 'jc',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'j.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : testStartTime.add(-1, 's').valueOf()
                },
                {
                    username: 'k',
                    password: '123',
                    nickname: 'knickname',
                    token: 'kt',
                    cid: 'kc',
                    specialInfo: {
                        sex: '女',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'k.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : testStartTime.add(-1, 's').valueOf()
                },
                {
                    username: 'l',
                    password: '123',
                    nickname: 'lnickname',
                    token: 'lt',
                    cid: 'lc',
                    specialInfo: {
                        sex: '女'
                    },
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : testStartTime.add(-1, 's').valueOf()
                },
                {
                    username: 'm',
                    password: '123',
                    nickname: 'mnickname',
                    token: 'mt',
                    cid: 'mc',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'm.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : testStartTime.add(-1, 's').valueOf()
                },
                {
                    username: 'n',
                    password: '123',
                    nickname: 'nnickname',
                    token: 'nt',
                    cid: 'nc',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'n.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                    //lastFakeTime : testStartTime.add(-1, 's').valueOf()
                },
                {
                    username: 'o',
                    password: '123',
                    nickname: 'onickname',
                    token: 'ot',
                    cid: 'oc',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'o.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-6, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                },
                {
                    username: 'p',
                    password: '123',
                    nickname: 'pnickname',
                    token: 'pt',
                    cid: 'pc',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'p.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-6, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                },
                {
                    username: 'q',
                    password: '123',
                    nickname: 'qnickname',
                    token: 'qt',
                    cid: 'qc',
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'q.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf()
                },
                {
                    username: 'r',
                    password: '123',
                    nickname: 'rnickname',
                    token: 'rt',
                    cid: 'rc',
                    specialInfo: {
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    },
                    specialPic : 'r.jpg',
                    specialInfoTime : moment(moment().format('YYYY-MM-DD')).add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : testStartTime.add(-1, 'm').valueOf(),
                    lastMeetCreateTime : testStartTime.add(-31, 's').valueOf(),
                    lastFakeTime : testStartTime.add(-1, 's').valueOf()
                }
            ];

            //初始化朋友
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
                },
                {
                    creater: {
                        username: 'a',
                        nickname: 'anickname'
                    },
                    target: {
                        username: 'x',
                        nickname: 'xnickname'
                    },
                    messages : []
                },
                {
                    creater: {
                        username: 'n',
                        nickname: 'nnickname'
                    },
                    target: {
                        username: 'x',
                        nickname: 'xnickname'
                    },
                    messages : []
                },
                {
                    creater: {
                        username: 'o',
                        nickname: 'onickname'
                    },
                    target: {
                        username: 'x',
                        nickname: 'xnickname'
                    },
                    messages : []
                },
                {
                    creater: {
                        username: 'p',
                        nickname: 'pnickname'
                    },
                    target: {
                        username: 'x',
                        nickname: 'xnickname'
                    },
                    messages : []
                }
            ];

            //初始化meet
            var meetArray = [
                {
                    creater: {
                        username: '1',
                        nickname: '1nickname',
                        specialPic: '1.jpg'
                    },
                    target: {
                        username: 'q',
                        nickname: 'qnickname',
                        specialPic: 'q.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'a',
                        nickname: 'anickname',
                        specialPic: 'a.jpg'
                    },
                    target: {
                        username: 'q',
                        nickname: 'qnickname',
                        specialPic: 'q.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'a',
                        nickname: 'anickname',
                        specialPic: 'a.jpg'
                    },
                    target: {
                        username: 'd',
                        nickname: 'dnickname',
                        specialPic: 'd.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'a',
                        nickname: 'anickname',
                        specialPic: 'a.jpg'
                    },
                    target: {
                        username: 'e',
                        nickname: 'enickname',
                        specialPic: 'e.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'a',
                        nickname: 'anickname',
                        specialPic: 'a.jpg'
                    },
                    target: {
                        username: 'k',
                        nickname: 'knickname',
                        specialPic: 'k.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'z',
                        nickname: 'znickname',
                        specialPic: 'z.jpg'
                    },
                    target: {
                        username: 'p',
                        nickname: 'pnickname',
                        specialPic: 'p.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'k',
                        nickname: 'knickname',
                        specialPic: 'k.jpg'
                    },
                    target: {
                        username: 'a',
                        nickname: 'anickname',
                        specialPic: 'a.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'k',
                        nickname: 'knickname',
                        specialPic: 'k.jpg'
                    },
                    target: {
                        username: 'n',
                        nickname: 'nnickname',
                        specialPic: 'n.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'n',
                        nickname: 'nnickname',
                        specialPic: 'n.jpg'
                    },
                    target: {
                        username: 'q',
                        nickname: 'qnickname',
                        specialPic: 'q.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },x
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'x',
                        nickname: 'xnickname',
                        specialPic: 'x.jpg'
                    },
                    target: {
                        username: 'i',
                        nickname: 'inickname',
                        specialPic: 'i.jpg'
                    },
                    status : '待回复',
                    replyLeft : 1,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'z',
                        nickname: 'znickname',
                        specialPic: 'z.jpg'
                    },
                    target: {
                        username: 'o',
                        nickname: 'onickname',
                        specialPic: 'o.jpg'
                    },
                    status : '待回复',
                    replyLeft : 0,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint
//                    specialInfo: {
//                        sex: { type: String, enum: ['男', '女'], required: true },
//                        hair  : { type: String, required: true },
//                        glasses : { type: String, required: true },
//                        clothesType : { type: String, required: true },
//                        clothesColor : { type: String, required: true },
//                        clothesStyle : { type: String, required: true }
//                    }
                },
                {
                    creater: {
                        username: 'm',
                        nickname: 'mnickname',
                        specialPic: 'm.jpg'
                    },
                    status : '待确认',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                {
                    creater: {
                        username: 'r',
                        nickname: 'rnickname',
                        specialPic: 'r.jpg'
                    },
                    status : '待确认',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                {
                    creater: {
                        username: 'n',
                        nickname: 'nnickname',
                        specialPic: 'n.jpg'
                    },
                    status : '待确认',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                {
                    creater: {
                        username: 'n',
                        nickname: 'nnickname',
                        specialPic: 'n.jpg'
                    },
                    status : '待确认',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                {
                    creater: {
                        username: 'n',
                        nickname: 'nnickname',
                        specialPic: 'n.jpg'
                    },
                    status : '待确认',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: '女',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                {
                    creater: {
                        username: 'n',
                        nickname: 'nnickname',
                        specialPic: 'n.jpg'
                    },
                    status : '待确认',
                    replyLeft : 2,
                    mapLoc : {
                        name : '北京银行(安华路支行)',
                        address : '北京市朝阳区外馆东街51号商业楼首层0102',
                        uid : '110941faff26cbcd4557261c'
                    },
                    personLoc : oriPoint,
                    specialInfo: {
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                }
            ];

            async.parallel([
                    function(callback){
                        User.remove(
                            function(err){
                                if (!err)
                                {
                                    User.create(userArray, callback);
                                }
                            }
                        );
                    },
                    function(callback){
                        Friend.remove(
                            function(err){
                                if (!err)
                                {
                                    Friend.create(friendArray, callback);
                                }
                            }
                        );
                    },
                    function(callback){
                        Meet.remove(
                            function(err){
                                if (!err)
                                {
                                    Meet.create(meetArray, callback);
                                }
                            }
                        );
                    }
                ],
                done
            );
        });
    });

    afterEach(function(done){
        db.close(done);
    });

    describe('注册', function(){
        it('缺少用户名', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        password: '123',
                        nickname: '1',
                        cid: '1',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少密码', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'username2',
                        nickname: '2',
                        cid: '2',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少nickname', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'username3',
                        password: '123',
                        cid: '3',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少sex', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'username4',
                        password: '123',
                        nickname: '4',
                        cid: '4'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('性别错误', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'username5',
                        password: '123',
                        nickname: '5',
                        cid: '5',
                        sex: 'gay'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少cid', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'username6',
                        password: '123',
                        nickname: '6',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少所有', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('username重复', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: '123',
                        nickname: 'anickname',
                        cid: 'd',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('用户名已存在!');
                    done(err);
                }
            );
        });

        it('[成功注册]', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'b',
                        password: '123',
                        nickname: 'bnickname',
                        cid: 'b',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.token.should.be.ok;
                    done(err);
                }
            );
        });
    });

    describe('登陆', function(){
        it('用户名不存在', function(done){
            request(
                {
                    url: serverRoot + "users/login",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a1',
                        password: '123',
                        cid: 'ac'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('用户名或密码错误!');
                    done(err);
                }
            );
        });

        it('用户名为空', function(done){
            request(
                {
                    url: serverRoot + "users/login",
                    method: 'POST',
                    json: true,
                    body: {
                        password: '123',
                        cid: 'ac'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('用户名不能为空!');
                    done(err);
                }
            );
        });

        it('密码错误', function(done){
            request(
                {
                    url: serverRoot + "users/login",
                    method: 'POST',
                    json: true,
                    body: {
                        username: '1',
                        password: '321',
                        cid: '1c'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('用户名或密码错误!');
                    done(err);
                }
            );
        });

        it('密码为空', function(done){
            request(
                {
                    url: serverRoot + "users/login",
                    method: 'POST',
                    json: true,
                    body: {
                        username: '1',
                        cid: '1c'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[成功登录]', function(done){
            request(
                {
                    url: serverRoot + "users/login",
                    method: 'POST',
                    json: true,
                    body: {
                        username: '1',
                        password: '123',
                        cid: '1c'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.token.should.be.ok;
                    done(err);
                }
            );
        });

        it('[登录后获取meets和friends]', function(done){
            request(
                {
                    url: serverRoot + "users/login",
                    method: 'POST',
                    json: true,
                    body: {
                        username: '1',
                        password: '123',
                        cid: '1c'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    //meet
                    var username1_q = false;
                    for (var i = 0; i < res.ppData.meets.length; i++)
                    {
                        if (res.ppData.meets[i].creater.username == '1' && res.ppData.meets[i].target.username == 'q')
                        {
                            username1_q = true;
                        }
                    }
                    username1_q.should.equal(true);
                    //friend
                    var friend1_q = false;
                    for (var i = 0; i < res.ppData.meets.length; i++)
                    {
                        if (res.ppData.meets[i].creater.username == '1' && res.ppData.meets[i].target.username == 'q')
                        {
                            username1_q = true;
                        }
                    }
                    username1_q.should.equal(true);
                    done(err);
                }
            );
        });
    })
})
