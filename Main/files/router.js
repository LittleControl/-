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

module.exports = router
