var express = require('express')
var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('MongoDB Connected Failed !')
    } else {
        console.log('MongoDB Connetced Successfully !')
    }
})

var account = mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    }
})
var Account = mongoose.model('Account', account)
var newUser = new Account({
    email: 'littlecontrol@qq.com',
    password: 'Nothing'
})
newUser.save(function (err, data) {
    if (err) {
        console.log('Saved Failed,Something is wrong !')
    } else {
        console.log('Save Successfully !')
    }
})

var song = mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    singer:{
        required:true,
        type:String
    },
    playNum:{
        required:true,
        type:Number
    },
    upTime:{
        type:Date,
        required:true,
        default: new Date
    },
    commitNum: {
        type:Number,
        default:0
    }
})
var Song = mongoose.model('Song',song)


var router = express.Router()
router.get('/', function (req, res) {
    res.render('login.html')
})

router.post('/index', function (req, res) {
    Account.find(req.body,function(err,data){
        if(err){
            console.log(err)
        } else {
            if(data.length === 0){
                /* 如果账户不存在之后的操作 */
                res.render('login.html',{
                    tips:'您输入的邮箱或密码有误,请重试',
                    data:data
                })
            } else {
                res.render('index.html')
            }
        }
    })
})

router.get('/dashboard',function(req,res){
    Song.find(function(err,data){
        if(err){
            console.log('DataBase Has Some Wrong !')
        } else {

            res.render('dashboard.html',{
                songs:data  
            })
        }
    })
})

router.get('/add',function(req,res){
    res.render('add.html')
})

router.post('/add',function(req,res){
    var newSong = new Song(req.body)
    newSong.save(function(err,data){
        if(err){
            return res.status(500).send(err)
            // return res.status(500).send('Server Errror !')
        }
        res.render('add_success.html')
    })
})

router.get('/song_manage',function(req,res){
    Song.find(function(err,data){
        if(err){
            return res.status(500).send('Server Error !')
        }
        res.render('song_manage.html',{
            songs:data
        })
    })
})

router.get('/update',function(req,res){
    var path = req.originalUrl
    var id = req.query.id
    Song.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            console.log("Nothing Can Be Find")
        } else {
            var song = {}
            song.id = id
            song.name = data.name
            song.singer = data.singer
            song.upTime = data.upTime
            song.playNum = data.playNum
            song.commitNum = data.commitNum
            song.path = path
            res.render('update.html', song)
        }
    })
})

router.post('/update',function(req,res){
    var obj = {
        id: req.query.id,
        name: req.body.name,
        singer: req.body.singer,
        upTime: JSON.parse(req.body.upTime),
        playNum: req.body.playNum,
        commitNum: req.body.commitNum
    }
    Song.updateOne({
        _id: obj.id
    }, obj, function (err, data) {
        if (err) {
            return res.status(500).send("ServeError !")
        } else {
            res.render('update_success.html')
        }
    })
})


router.get('/delete',function(req,res){
    var path = req.originalUrl
    var id = req.query.id
    Song.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            console.log("Nothing Can Be Find")
        } else {
            var song = {}
            song.id = id
            song.name = data.name
            song.singer = data.singer
            song.upTime = data.upTime
            song.playNum = data.playNum
            song.commitNum = data.commitNum
            song.path = path
            res.render('delete.html', song)
        }
    })
})

router.post('/delete',function(req,res){
    var id = req.query.id
    Song.deleteOne({
        _id: id
    }, obj, function (err, data) {
        if (err) {
            return res.status(500).send("Server Error !")
        } else {
            res.render('delete_success.html')
        }
    })
})



module.exports = router
