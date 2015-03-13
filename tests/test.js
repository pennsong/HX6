var assert = require("assert");
var chai = require("chai");
chai.use(require('chai-subset'));
chai.use(require('chai-things'));
//chai.use(function(chai, utils) {
//    utils.addMethod(chai.Assertion.prototype, 'ppContain2', method);
//
//    /**
//     * @param {Object} expected
//     * @throws {Error}
//     */
//    function method(expected) {
//        var tmpArray = utils.flag(this, 'object');
//
//        for (var i=0; i< tmpArray.length; i++)
//        {
//            if (tmpArray[i].should.containSubset(expected))
//            {
//                return true;
//            }
//        }
//        return false;
//    }
//});

chai.use(function(chai, utils) {
    utils.addMethod(chai.Assertion.prototype, 'ppContain', method);

    function deepFind(obj, path) {
        var paths = path.split('.')
            , current = obj
            , i;

        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }

    /**
     * @param {Object} expected
     * @throws {Error}
     */
    function method(expected) {
        var tmpArray = utils.flag(this, 'object');

        for (var i = 0; i < tmpArray.length; i++)
        {
            var tmpResult = true;
            Object.keys(expected).forEach(function(k) {
                tmpResult = (tmpResult && (deepFind(tmpArray[i], k) == expected[k]));
            });
            if (tmpResult)
            {
                true.should.equal(true);
                return;
            }
        }
        assert(false, JSON.stringify(expected) + "应该存在!");
        return;
    }
});

chai.use(function(chai, utils) {
    utils.addMethod(chai.Assertion.prototype, 'ppNotContain', method);

    function deepFind(obj, path) {
        var paths = path.split('.')
            , current = obj
            , i;

        for (i = 0; i < paths.length; ++i) {
            if (current[paths[i]] == undefined) {
                return undefined;
            } else {
                current = current[paths[i]];
            }
        }
        return current;
    }

    /**
     * @param {Object} expected
     * @throws {Error}
     */
    function method(expected) {
        var tmpArray = utils.flag(this, 'object');

        for (var i = 0; i < tmpArray.length; i++)
        {
            var tmpResult = true;
            Object.keys(expected).forEach(function(k) {
                tmpResult = (tmpResult && (deepFind(tmpArray[i], k) == expected[k]));
            });
            if (tmpResult)
            {
                assert(false, JSON.stringify(expected) + "不应该存在!");
                return;
            }
        }
        true.should.equal(true);
        return;
    }
});
var should = chai.should();

//var should = require('should');
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-6, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
                    //lastFakeTime : Date
                },
                {
                    username: 'd',
                    password: '123',
                    nickname: 'dnickname',
                    token: 'dt',
                    cid: 'dc',
                    specialInfo: {
                        sex: '女'
                    },
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf()
                },
                {
                    username: 'e',
                    password: '123',
                    nickname: 'enickname',
                    token: 'et',
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
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf()
                    //lastMeetCreateTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf()
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
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : farPoint,
                    lastLocationTime : moment(testStartTime).add(-6, 'm').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf(),
                    lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
                    //lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
                    //lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
                    //lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
                    //lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
                    //lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-6, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-6, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf()
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
                    specialInfoTime : moment().startOf('day').add(1, 's').valueOf(),
                    lastLocation : oriPoint,
                    lastLocationTime : moment(testStartTime).add(-1, 'm').valueOf(),
                    lastMeetCreateTime : moment(testStartTime).add(-31, 's').valueOf(),
                    lastFakeTime : moment(testStartTime).add(-1, 's').valueOf()
                }
            ];

            //初始化朋友
            var friendArray = [
                {
                    users: [
                        {
                            username: '1',
                            nickname: '1nickname'
                        },
                        {
                            username: 'x',
                            nickname: 'xnickname'
                        }
                    ],
                    messages : []
                },
                {
                    users: [
                        {
                            username: 'a',
                            nickname: 'anickname'
                        },
                        {
                            username: 'x',
                            nickname: 'xnickname'
                        }
                    ],
                    messages : []
                },
                {
                    users: [
                        {
                            username: 'n',
                            nickname: 'nnickname'
                        },
                        {
                            username: 'x',
                            nickname: 'xnickname'
                        }
                    ],
                    messages : []
                },
                {
                    users: [
                        {
                            username: 'o',
                            nickname: 'onickname'
                        },
                        {
                            username: 'x',
                            nickname: 'xnickname'
                        }
                    ],
                    messages : []
                },
                {
                    users: [
                        {
                            username: 'p',
                            nickname: 'pnickname'
                        },
                        {
                            username: 'x',
                            nickname: 'xnickname'
                        }
                    ],
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
                    res.ppData.meets.should.ppContain(
                        {
                            'creater.username' : '1',
                            'target.username' : 'q'
                        }
                    );
                    //friend
                    res.ppData.friends.length.should.equal(1);
                    var tmpFriendFind = false;
                    for (var i = 0; i < res.ppData.friends.length; i++)
                    {
                        if (res.ppData.friends[i].users.should.ppContain({'username': '1'})){
                            tmpFriendFind = true;
                            break;
                        }
                    }
                    tmpFriendFind.should.equal(true);
                    done(err);
                }
            );
        });
    });

    describe('上传最新位置', function(){
        it('[成功更新位置信息]', function(done){
            request(
                {
                    url: serverRoot + "users/updateLocation",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        lng: 125,
                        lat: 43
                    }
                },
                function(err, im, res){
                    if (!err){
                        im.statusCode.should.equal(200);
                        res.ppResult.should.equal('ok');
                        User.findOne({username: 'a'}).exec(function(err, doc){
                            if (!err){
                                doc.lastLocation[0].should.equal(125);
                                doc.lastLocation[1].should.equal(43);
                                done();
                            }
                            else
                            {
                                done(err);
                            }
                        });
                    }else
                    {
                        done(err);
                    }
                }
            );
        });

        it('缺少token', function(done){
            request(
                {
                    url: serverRoot + "users/updateLocation",
                    method: 'POST',
                    json: true,
                    body: {
                        lng: 125,
                        lat: 43
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少lat', function(done){
            request(
                {
                    url: serverRoot + "users/updateLocation",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        lng: 125
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('缺少lng', function(done){
            request(
                {
                    url: serverRoot + "users/updateLocation",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        lat: 43
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });
    });

    describe('是否可以发送meet', function(){
        it('[未填写specialInfo无法发起meet]', function(done){
            request(
                {
                    url: serverRoot + "users/sendMeetCheck",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'dt'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('请更新特征信息!');
                    done(err);
                }
            );
        });

        it('[当天0点前更新的specialInfo无法发起meet]', function(done){
            request(
                {
                    url: serverRoot + "users/sendMeetCheck",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'et'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('请更新特征信息!');
                    done(err);
                }
            );
        });

        it('[最新5分钟内无上传最新位置无法发起meet]', function(done){
            request(
                {
                    url: serverRoot + "users/sendMeetCheck",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'yt'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('无法定位最新位置!');
                    done(err);
                }
            );
        });

        it('[可以创建meet]', function(done){
            request(
                {
                    url: serverRoot + "users/sendMeetCheck",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    done(err);
                }
            );
        });

        it('[最近30s有发送meet记录无法发起meet]', function(done){
            request(
                {
                    url: serverRoot + "users/sendMeetCheck",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'zt'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.match(/^距离允许发送新邀请还有/);
                    done(err);
                }
            );
        });
    });

    describe('获取百度场所信息', function(){
        it('[根据keyword查找百度信息]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        keyword: '麦当劳'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.should.be.ok;
                    done(err);
                }
            );
        });

        it('keyword为空', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });
    });

    describe('创建meet查找目标', function(){
        it('[target Sex没有填写不能创建]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[target Hair没有填写不能创建]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[target glasses没有填写不能创建]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[target clothesType没有填写不能创建]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[target clothesColor没有填写不能创建]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[target clothesStyle没有填写不能创建]', function(done){
            request(
                {
                    url: serverRoot + "users/searchLoc",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[成功找到符合条件的target]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.should.ppContain({username: 'z', specialPic: 'z.jpg'});
                    res.ppData.should.ppContain({username: 'c', specialPic: 'c.jpg'});
                    res.ppData.should.ppNotContain({username: 'x', specialPic: 'x.jpg'});
                    res.ppData.should.ppNotContain({username: 'y', specialPic: 'y.jpg'});
                    res.ppData.should.ppNotContain({username: 'h', specialPic: 'h.jpg'});
                    res.ppData.should.ppNotContain({username: 'q', specialPic: 'q.jpg'});
                    res.ppData.should.ppNotContain({username: 'd', specialPic: 'd.jpg'});
                    res.ppData.should.ppNotContain({username: 'e', specialPic: 'e.jpg'});
                    done(err);
                }
            );
        });

        it('[无法找到自己]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        hair: '竖起来（包括光头）',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.indexOf({username: 'a', specialPic: 'a.jpg'}).should.equal(-1);
                    done(err);
                }
            );
        });

        it('[成功找到符合条件的target]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        sex: '男',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.indexOf({username: 'z', specialPic: 'z.jpg'}).should.equal(-1);
                    done(err);
                }
            );
        });
    });

    describe('确认meet查找目标', function(){
        it('[缺少meetId无法查找]', function(done){
            request(
                {
                    url: serverRoot + "users/confirmMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'nt'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[成功找到符合条件的target]', function(done){
            Meet.findOne(
                {
                    'creater.username': 'n',
                    'specialInfo.sex': '女',
                    'specialInfo.hair': '辫子/盘发',
                    'specialInfo.glasses' : '无',
                    'specialInfo.clothesType' : '大衣',
                    'specialInfo.clothesColor' : '白',
                    'specialInfo.clothesStyle' : '纯色',
                    status: '待确认'
                }
            ).exec(function(err, doc){
                    if (!err)
                    {
                        assert(doc !== null, 'doc要存在');
                        request(
                            {
                                url: serverRoot + "users/confirmMeetSearchTarget",
                                method: 'POST',
                                json: true,
                                body: {
                                    token: 'nt',
                                    meetId: doc._id
                                }
                            },
                            function(err, im, res){
                                im.statusCode.should.equal(200);
                                res.ppResult.should.equal('ok');
                                res.ppData.should.ppContain({username: 'z', specialPic: 'z.jpg'});
                                res.ppData.should.ppContain({username: 'c', specialPic: 'c.jpg'});
                                done(err);
                            }
                        );
                    }
                    else
                    {
                        done(err);
                    }
                }
            );
        });

        it('[不属于自己的meetId无法查找]', function(done){
            Meet.findOne({'creater.username': 'm'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/confirmMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'nt',
                                meetId: doc._id
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            res.ppMsg.should.equal('没有对应meet!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[不存在的meetId无法查找]', function(done){
            request(
                {
                    url: serverRoot + "users/confirmMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'nt',
                        meetId: '55001c6180202da9e391d8b0'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('没有对应meet!');
                    done(err);
                }
            );
        });

        it('[自己的meetId但状态不是"待确认"无法查找]', function(done){
            Meet.findOne({'creater.username': 'n', 'target.username': 'q'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/confirmMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'nt',
                                meetId: doc._id
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            res.ppMsg.should.equal('没有对应meet!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });
    });

    describe('创造meet不在其中', function(){
        it('[创建待确认meet成功]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetNo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        mapLocName: 'tname',
                        mapLocUid: '110941faff26cbcd4557261c',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        sex: '男',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    Meet.findOne({'creater.username': 'a', status: '待确认', 'mapLoc.name': 'tname'}).exec(function(err, doc){
                        if (!err)
                        {
                            assert(doc !== null, 'doc要存在');
                            User.findOne({username: 'a'}).exec(function(err, doc){
                                if (!err)
                                {
                                    doc.lastMeetCreateTime.should.above(moment().add(-3, 's'));
                                    done();
                                }
                                else
                                {
                                    done(err);
                                }
                            });
                        }
                        else
                        {
                            done(err);
                        }
                    });
                }
            );
        });
    });

    describe('创建/确认meet点击fake', function(){
        it('[30s内有点击fake, 再次点击fake把meet最后发送时间修改为now]', function(done){
            request(
                {
                    url: serverRoot + "users/createOrConfirmClickFake",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'it'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    User.findOne({username: 'i'}).exec(function(err, doc){
                        if (!err)
                        {
                            doc.lastMeetCreateTime.should.above(moment().add(-3, 's'));
                            should.not.exist(doc.lastFakeTime);
                            done();
                        }
                        else
                        {
                            done(err);
                        }
                    });
                }
            );
        });

        it('[30s内无点击fake, 点击fake把最后点击fake时间修改为now]', function(done){
            request(
                {
                    url: serverRoot + "users/createOrConfirmClickFake",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'jt'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    User.findOne({username: 'j'}).exec(function(err, doc){
                        if (!err)
                        {
                            doc.lastFakeTime.should.above(moment().add(-3, 's'));
                            done();
                        }
                        else
                        {
                            done(err);
                        }
                    });
                }
            );
        });
    });

    describe('创建meet, 点击真人', function(){
        it('[输入不存在的username,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'it',
                        username: 'abc'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('[输入自己的username,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'it',
                        username: 'i'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('[不输入username,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'it'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    done(err);
                }
            );
        });

        it('[未填写自己的specialInfo,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'dt',
                        username: 'c',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('请更新特征信息!');
                    done(err);
                }
            );
        });

        it('[自己的specialInfo过期,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'et',
                        username: 'c',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('请更新特征信息!');
                    done(err);
                }
            );
        });

        it('[最近5分钟无上传最新位置,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'yt',
                        username: 'c',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('无法定位最新位置!');
                    done(err);
                }
            );
        });

        it('[最近30s有发送meet记录,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'zt',
                        username: 'c',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.match(/^距离允许发送新邀请还有/);
                    done(err);
                }
            );
        });

        it('[是已有朋友,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        username: 'x',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('此人已是你好友!');
                    done(err);
                }
            );
        });

        it('[发送对象是待回复的meet中的目标,无法创建]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        username: 'q',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('已对此人发过邀请!');
                    done(err);
                }
            );
        });

        it('[如果是互发, 则生成朋友并修改对方meet状态为"成功"]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        username: 'k',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    Friend.findOne(
                        {
                            users: {
                                $elemMatch: {username: 'a', username: 'k'}
                            }
                        }
                    ).exec(function(err, doc){
                            if (!err){
                                assert(doc !== null, 'doc要存在');
                                Meet.findOne({'creater.username': 'k', 'target.username': 'a'}).exec(
                                    function(err, doc)
                                    {
                                        if (!err) {
                                            doc.status.should.equal('成功');
                                            done();
                                        }
                                        else{
                                            done(err);
                                        }
                                    }
                                );
                            }
                            else
                            {
                                done(err);
                            }
                        }
                    );
                }
            );
        });

        it('[成功生成meet]', function(done){
            request(
                {
                    url: serverRoot + "users/createMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'it',
                        username: 'x',
                        mapLocName: '北京银行(安华路支行)',
                        mapLocAddress: '北京市朝阳区外馆东街51号商业楼首层0102',
                        mapLocUid: '110941faff26cbcd4557261c'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    Meet.findOne({'creater.username': 'i', 'target.username': 'x'}).exec(
                        function(err, doc)
                        {
                            if (!err) {
                                doc.status.should.be.ok;

                                User.findOne({username: 'i'}).exec(function(err, doc){
                                    if (!err) {
                                        doc.lastMeetCreateTime.should.above(moment().add(-3, 's'));
                                        should.not.exist(doc.lastFakeTime);
                                        done();
                                    }
                                    else{
                                        done(err);
                                    }
                                });
                            }
                            else{
                                done(err);
                            }
                        }
                    );
                }
            );
        });
    });

    describe('更新specialInfo', function(){
        it('[成功更新specialInfo和specialPic和SpecialInfoTime为now]', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'lt',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色',
                        specialPic: 'l.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    User.findOne({username: 'l'}).exec(function(err, doc){
                        if (!err) {
                            doc.specialInfoTime.should.above(moment().add(-3, 's'));
                            doc.specialInfo.hair.should.equal('辫子/盘发');
                            doc.specialInfo.glasses.should.equal('无');
                            doc.specialInfo.clothesType.should.equal('大衣');
                            doc.specialInfo.clothesColor.should.equal('白');
                            doc.specialInfo.clothesStyle.should.equal('纯色');
                            doc.specialPic.should.equal('l.jpg');
                            done();
                        }
                        else{
                            done(err);
                        }
                    });
                }
            );
        });

        it('[成功更新specialInfo和specialPic和SpecialInfoTime为now]', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '躺下',
                        glasses : '有',
                        clothesType : '长袖衬衫',
                        clothesColor : '黑',
                        clothesStyle : '线条/格子/色块',
                        specialPic: 'a2.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    User.findOne({username: 'a'}).exec(function(err, doc){
                        if (!err) {
                            doc.specialInfoTime.should.above(moment().add(-3, 's'));
                            doc.specialInfo.hair.should.equal('躺下');
                            doc.specialInfo.glasses.should.equal('有');
                            doc.specialInfo.clothesType.should.equal('长袖衬衫');
                            doc.specialInfo.clothesColor.should.equal('黑');
                            doc.specialInfo.clothesStyle.should.equal('线条/格子/色块');
                            doc.specialPic.should.equal('a2.jpg');
                            done();
                        }
                        else{
                            done(err);
                        }
                    });
                }
            );
        });

        it('缺少hair', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        glasses : '有',
                        clothesType : '长袖衬衫',
                        clothesColor : '黑',
                        clothesStyle : '线条/格子/色块',
                        specialPic: 'a2.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('缺少glasses', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '躺下',
                        clothesType : '长袖衬衫',
                        clothesColor : '黑',
                        clothesStyle : '线条/格子/色块',
                        specialPic: 'a2.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('缺少clothesType', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '躺下',
                        glasses : '有',
                        clothesColor : '黑',
                        clothesStyle : '线条/格子/色块',
                        specialPic: 'a2.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('缺少clothesColor', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '躺下',
                        glasses : '有',
                        clothesType : '长袖衬衫',
                        clothesStyle : '线条/格子/色块',
                        specialPic: 'a2.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('缺少clothesStyle', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '躺下',
                        glasses : '有',
                        clothesType : '长袖衬衫',
                        clothesColor : '黑',
                        specialPic: 'a2.jpg'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('缺少specialPic', function(done){
            request(
                {
                    url: serverRoot + "users/updateSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at',
                        hair: '躺下',
                        glasses : '有',
                        clothesType : '长袖衬衫',
                        clothesColor : '黑',
                        clothesStyle : '线条/格子/色块'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });
    });

    describe('获取自己specialInfo', function(){
        it('[成功获取, 已有specialInfo]', function(done){
            request(
                {
                    url: serverRoot + "users/getSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'at'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    res.ppData.specialInfo.hair.should.equal('竖起来（包括光头）');
                    res.ppData.specialInfo.glasses.should.equal('无');
                    res.ppData.specialInfo.clothesType.should.equal('大衣');
                    res.ppData.specialInfo.clothesColor.should.equal('白');
                    res.ppData.specialInfo.clothesStyle.should.equal('纯色');
                    res.ppData.specialPic.should.equal('a.jpg');
                    done(err);
                }
            );
        });

        it('[成功获取, 无specialInfo]', function(done){
            request(
                {
                    url: serverRoot + "users/getSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'dt'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    should.not.exist(res.ppData);
                    done(err);
                }
            );
        });

        it('[成功获取, specialInfo过期]', function(done){
            request(
                {
                    url: serverRoot + "users/getSpecialInfo",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'et'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(200);
                    res.ppResult.should.equal('ok');
                    should.not.exist(res.ppData);
                    done(err);
                }
            );
        });
    });

    describe('回复meet查找目标', function(){
        it('[当前用户不是此meet的target, 无法查找]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'qt',
                                meetId: doc._id,
                                sex: '女',
                                hair: '辫子/盘发',
                                glasses : '无',
                                clothesType : '大衣',
                                clothesColor : '白',
                                clothesStyle : '纯色'
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[错误的meetId, 无法查找]', function(done){
            request(
                {
                    url: serverRoot + "users/replyMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'qt',
                        meetId: '55011385307f493d01f69504',
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '无',
                        clothesType : '大衣',
                        clothesColor : '白',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('没有对应meet!');
                    done(err);
                }
            );
        });

        it('[replyLeft > 1, 则需要减一]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                meetId: doc._id,
                                sex: '女',
                                hair: '辫子/盘发',
                                glasses : '无',
                                clothesType : '大衣',
                                clothesColor : '白',
                                clothesStyle : '纯色'
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(200);
                            res.ppResult.should.equal('ok');
                            var truePic = 0;
                            var fakePic = 0;
                            for (var i = 0; i < res.ppData.length; i++){
                                if (res.ppData[i].username == 'z' && res.ppData[i].specialPic == 'z.jpg')
                                {
                                    truePic++;
                                }
                                if (res.ppData[i].username == 'fake' && res.ppData[i].specialPic == 'fake.png')
                                {
                                    fakePic++;
                                }
                            }
                            truePic.should.equal(1);
                            fakePic.should.equal(4);

                            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                                if (!err)
                                {
                                    doc.replyLeft.should.equal(0);
                                    done();
                                }
                                else
                                {
                                    done(err);
                                }
                            });
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[replyLeft == 0, 无法查找]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'o'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'ot',
                                meetId: doc._id,
                                sex: '女',
                                hair: '辫子/盘发',
                                glasses : '无',
                                clothesType : '大衣',
                                clothesColor : '白',
                                clothesStyle : '纯色'
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            res.ppMsg.should.equal('无回复次数!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[target sex不符合, 无法查找]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                meetId: doc._id,
                                sex: '男',
                                hair: '辫子/盘发',
                                glasses : '无',
                                clothesType : '大衣',
                                clothesColor : '白',
                                clothesStyle : '纯色'
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(200);
                            res.ppResult.should.equal('ok');
                            res.ppMsg.should.equal('特征信息不匹配!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[1项容错, 成功查找]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                meetId: doc._id,
                                sex: '女',
                                hair: '辫子/盘发',
                                glasses : '有',
                                clothesType : '大衣',
                                clothesColor : '白',
                                clothesStyle : '纯色'
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(200);
                            res.ppResult.should.equal('ok');
                            var truePic = 0;
                            var fakePic = 0;
                            for (var i = 0; i < res.ppData.length; i++){
                                if (res.ppData[i].username == 'z' && res.ppData[i].specialPic == 'z.jpg')
                                {
                                    truePic++;
                                }
                                if (res.ppData[i].username == 'fake' && res.ppData[i].specialPic == 'fake.png')
                                {
                                    fakePic++;
                                }
                            }
                            truePic.should.equal(1);
                            fakePic.should.equal(4);

                            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                                if (!err)
                                {
                                    doc.replyLeft.should.equal(0);
                                    done();
                                }
                                else
                                {
                                    done(err);
                                }
                            });
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[2项错误, 无法查找]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetSearchTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                meetId: doc._id,
                                sex: '女',
                                hair: '辫子/盘发',
                                glasses : '有',
                                clothesType : '大衣',
                                clothesColor : '黑',
                                clothesStyle : '纯色'
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(200);
                            res.ppResult.should.equal('ok');
                            res.ppMsg.should.equal('特征信息不匹配!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[缺少必填项, 无法查找]', function(done){
            request(
                {
                    url: serverRoot + "users/replyMeetSearchTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'pt',
                        sex: '女',
                        hair: '辫子/盘发',
                        glasses : '有',
                        clothesType : '大衣',
                        clothesColor : '黑',
                        clothesStyle : '纯色'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });
    });

    describe('回复meet, 点击真人', function(){
        it('[输入不存在的username,无法创建]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetClickTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                username: 'abc',
                                meetId: doc.meetId
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[输入自己的username,无法创建]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetClickTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                username: 'p',
                                meetId: doc.meetId
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[不输入username,无法创建]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetClickTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                meetId: doc.meetId
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[当前用户不是此meet的target, 无法点击]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetClickTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'qt',
                                username: 'z',
                                meetId: doc._id
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            res.ppMsg.should.equal('没有对应meet!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[缺少meetId, 无法点击]', function(done){
            request(
                {
                    url: serverRoot + "users/replyMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'pt',
                        username: 'z'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('缺少必填项!');
                    done(err);
                }
            );
        });

        it('[meetId不存在, 无法点击]', function(done){
            request(
                {
                    url: serverRoot + "users/replyMeetClickTarget",
                    method: 'POST',
                    json: true,
                    body: {
                        token: 'pt',
                        username: 'z',
                        meetId: '5502560c40db57d2383fe139'
                    }
                },
                function(err, im, res){
                    im.statusCode.should.equal(400);
                    res.ppResult.should.equal('err');
                    res.ppMsg.should.equal('没有对应meet!');
                    done(err);
                }
            );
        });

        it('[成功]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetClickTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                username: 'z',
                                meetId: doc._id
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(200);
                            res.ppResult.should.equal('ok');
                            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                                if (!err)
                                {
                                    doc.status.should.equal('成功');
                                    Friend.findOne(
                                        {
                                            users: {
                                                $elemMatch: {username: 'z', username: 'p'}
                                            }
                                        }
                                    ).exec(function(err, doc){
                                            if (!err){
                                                assert(doc !== null, 'doc要存在');
                                                done();
                                            }
                                            else
                                            {
                                                done(err);
                                            }
                                        }
                                    );
                                }
                                else
                                {
                                    done(err);
                                }
                            });
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });

        it('[回复的username不是meetId所属meet的creater, 无法点击]', function(done){
            Meet.findOne({'creater.username': 'z', 'target.username': 'p'}).exec(function(err, doc){
                if (!err)
                {
                    request(
                        {
                            url: serverRoot + "users/replyMeetClickTarget",
                            method: 'POST',
                            json: true,
                            body: {
                                token: 'pt',
                                username: 'y',
                                meetId: doc._id
                            }
                        },
                        function(err, im, res){
                            im.statusCode.should.equal(400);
                            res.ppResult.should.equal('err');
                            res.ppMsg.should.equal('没有对应meet!');
                            done(err);
                        }
                    );
                }
                else
                {
                    done(err);
                }
            });
        });
    });
});
