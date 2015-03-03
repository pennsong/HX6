var assert = require("assert");
var should = require('should');
var User = require('../data/models/user');
var request = require('request');
var serverRoot = 'http://localhost:3000/'

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
            //清空user
            User.remove(
                function(err){
                    if (!err)
                    {
                        //新加用户a
                        User.create(
                            {
                                username: 'a',
                                password: 'a',
                                nickname: 'an',
                                token: 'at',
                                cid: 'testCid',
                                'specialInfo.sex': '男'
                            },
                            done
                        );
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
                        username: 'b',
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

    describe('新加重名用户', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: 'a',
                        nickname: 'an',
                        token: 'at',
                        cid: 'testCid',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.code.should.equal(11000);
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失cid', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: 'a',
                        nickname: 'an',
                        token: 'at',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors.cid.type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失用户名', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        password: 'a',
                        nickname: 'an',
                        token: 'at',
                        cid: 'testCid',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors.username.type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失密码', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        nickname: 'an',
                        token: 'at',
                        cid: 'testCid',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors.password.type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失昵称', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: 'a',
                        token: 'at',
                        cid: 'testCid',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors.nickname.type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失令牌', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: 'a',
                        nickname: 'an',
                        cid: 'testCid',
                        sex: '男'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors.token.type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失性别', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: 'a',
                        nickname: 'an',
                        cid: 'testCid',
                        token: 'at'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors['specialInfo.sex'].type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户缺失所有(除了cid)', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        cid: 'testCid'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors['specialInfo.sex'].type.should.equal("required");
                    done(err);
                }
            );
        })
    })

    describe('新加用户错误的性别', function(){
        it('应该保存失败', function(done){
            request(
                {
                    url: serverRoot + "users/register",
                    method: 'POST',
                    json: true,
                    body: {
                        username: 'a',
                        password: 'a',
                        nickname: 'an',
                        cid: 'testCid',
                        token: 'at',
                        sex: '人妖'
                    }
                },
                function(err, im, res)
                {
                    im.statusCode.should.equal(400);
                    res.errors['specialInfo.sex'].type.should.equal("enum");
                    done(err);
                }
            );
        })
    })
})