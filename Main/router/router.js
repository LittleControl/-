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
    name: {
        required: true,
        type: String
    },
    singer: {
        required: true,
        type: String
    },
    playNum: {
        required: true,
        type: Number
    },
    upTime: {
        type: Date,
        required: true,
        default: new Date
    },
    commitNum: {
        type: Number,
        default: 0
    }
})
var Song = mongoose.model('Song', song)

var user = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    song: {
        type: String,
        required: true,
    },
    commit_time: {
        type: Date,
        required: true,
        default: new Date
    }
})

var User = mongoose.model("User", user)
var user1 = new User({
    name: 'Nothing',
    message: 'Cool',
    song: 'Nothing',
})
user1.save()

var router = express.Router()

router.get('/', function (req, res) {
    res.render('login.html')
})

router.get('/index', function (req, res) {
    res.render('404.html')
})

router.post('/index', function (req, res) {
    Account.findOne(req.body, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            if (data.length === 0) {
                /* 如果账户不存在之后的操作 */
                res.render('login.html', {
                    tips: '您输入的邮箱或密码有误,请重试',
                })
            } else {
                User.find(function (err, data1) {
                    if (err) {
                        console.log('Someting is wrong !')
                    } else {
                        /* 首页一共有4个需要渲染的地方,每个里面需要两个data1的数据 */
                        var songs = [{}, {}, {}, {}]
                        /* 随机渲染 */
                        for (let i = 0; i < 4; i++) {
                            var ran1 = Math.round(Math.random() * (data1.length - 1));
                            var ran2 = Math.round(Math.random() * (data1.length - 1));
                            songs[i].song1 = data1[ran1].song
                            songs[i].message1 = data1[ran1].message
                            songs[i].song2 = data1[ran2].song
                            songs[i].message2 = data1[ran2].message
                        }
                        res.render('index.html', {
                            id: data.id,
                            email: data.email,
                            songs: songs
                        })
                    }
                })
            }
        }
    })
})

router.get('/dashboard', function (req, res) {
    /* 这里借用JSON方法stringify方法来判断对象是否为空 */
    if (JSON.stringify(req.query) === '{}') {
        return res.render('404.html')
    }
    Account.findOne(req.body, function (err, data) {
        if (err) {
            return res.status(500).send("Server Error !")
        }
        if (JSON.stringify(data) === '{}') {
            return res.render('404.html')
        }
        Song.find(function (err, data) {
            if (err) {
                console.log('DataBase Has Some Wrong !')
            } else {
                res.render('dashboard.html', {
                    songs: data
                })
            }
        })
    })
})

router.get('/add', function (req, res) {
    res.render('add.html')
})

router.post('/add', function (req, res) {
    var newSong = new Song(req.body)
    newSong.save(function (err, data) {
        if (err) {
            return res.status(500).send(err)
            // return res.status(500).send('Server Errror !')
        }
        res.render('add_success.html')
    })
})

router.get('/song_manage', function (req, res) {
    Song.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        res.render('song_manage.html', {
            songs: data
        })
    })
})

router.get('/update', function (req, res) {
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

router.post('/update', function (req, res) {
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

router.get('/delete', function (req, res) {
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

router.post('/delete', function (req, res) {
    var id = req.query.id
    Song.deleteOne({
        _id: id
    }, function (err, data) {
        if (err) {
            return res.status(500).send("Server Error !")
        } else {
            res.render('delete_success.html')
        }
    })
})

router.get('/add_commit', function (req, res) {
    var id = req.query.id
    Song.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            console.log("Nothing Can Be Find")
        } else {
            var song = {}
            song.name = data.name
            res.render('add_commit.html', song)
        }
    })
})

router.post('/add_commit', function (req, res) {
    var obj = {
        name: req.body.name,
        message: req.body.message,
        song: req.body.song
    }
    var newUser = new User(obj)
    newUser.save(function (err, data) {
        if (err) {
            return res.status(500).send("Server Error !")
        }
    })
    res.redirect('/last_commit')
})

router.get('/last_commit', function (req, res) {
    User.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        res.render('last_commit.html', {
            commits: data
        })
    })
})

router.get('/commit_manage', function (req, res) {
    User.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        res.render('commit_manage.html', {

            commits: data
        })
    })
})

router.get('/update_commit', function (req, res) {
    var id = req.query.id
    User.findOne({
        _id: id
    }, function (err, data) {
        if (err) {
            console.log("Nothing Can Be Find")
        } else {
            var commit = {}
            commit.id = id
            commit.name = data.name
            commit.message = data.message
            res.render('update_commit.html', commit)
        }
    })
})

router.post('/update_commit', function (req, res) {
    User.updateOne({
        _id: req.query.id
    }, req.body, function (err) {
        if (err) {
            return res.status(500).send('Server Error !')
        } else {
            console.log('Update Commit Successfully !')
        }
    })
    res.redirect('/commit_manage')
})

router.get('/delete_commit', function (req, res) {
    User.findOne({
        _id: req.query.id
    }, function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        var commit = {}
        commit.id = req.query.id
        commit.name = data.name
        commit.message = data.message
        res.render('delete_commit.html', commit)
    })
})

router.post('/delete_commit', function (req, res) {
    User.deleteOne({
        _id: req.query.id
    }, function (err) {
        if (err) {
            console.log('Something is wrong !')
        } else {
            console.log('Delete Successfully!')
        }
    })
    res.redirect('/commit_manage')
})

function TimeSort(arr) {
    var left = 0;
    var right = arr.length - 1
    function Temp(arr, left, right) {
        if (left >= right) {
            return
        }
        var count = left
        for (var i = left; i < right; i++) {
            if (arr[i].upTime.getTime() > arr[right].upTime.getTime()) {
                var temp = arr[i]
                arr[i] = arr[count]
                arr[count] = temp
                count++
            }
        }
        var temp = arr[right]
        arr[right] = arr[count]
        arr[count] = temp
        Temp(arr, left, count - 1)
        Temp(arr, count + 1, right)
    }
    Temp(arr, left, right)
}
function PlayNumSort(arr) {
    var left = 0;
    var right = arr.length - 1
    function Temp(arr, left, right) {
        if (left >= right) {
            return
        }
        var count = left
        for (var i = left; i < right; i++) {
            if (arr[i].playNum > arr[right].playNum) {
                var temp = arr[i]
                arr[i] = arr[count]
                arr[count] = temp
                count++
            }
        }
        var temp = arr[right]
        arr[right] = arr[count]
        arr[count] = temp
        Temp(arr, left, count - 1)
        Temp(arr, count + 1, right)
    }
    Temp(arr, left, right)
}
function CommitNumSort(arr) {
    var left = 0;
    var right = arr.length - 1
    function Temp(arr, left, right) {
        if (left >= right) {
            return
        }
        var count = left
        for (var i = left; i < right; i++) {
            if (arr[i].commitNum > arr[right].commitNum) {
                var temp = arr[i]
                arr[i] = arr[count]
                arr[count] = temp
                count++
            }
        }
        var temp = arr[right]
        arr[right] = arr[count]
        arr[count] = temp
        Temp(arr, left, count - 1)
        Temp(arr, count + 1, right)
    }
    Temp(arr, left, right)
}
function SingerSort(arr) {
    var left = 0;
    var right = arr.length - 1
    function Temp(arr, left, right) {
        if (left >= right) {
            return
        }
        var count = left
        for (var i = left; i < right; i++) {
            if (arr[i].singer > arr[right].singer) {
                var temp = arr[i]
                arr[i] = arr[count]
                arr[count] = temp
                count++
            }
        }
        var temp = arr[right]
        arr[right] = arr[count]
        arr[count] = temp
        Temp(arr, left, count - 1)
        Temp(arr, count + 1, right)
    }
    Temp(arr, left, right)
}

router.get('/sortByTime', function (req, res) {
    Song.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        TimeSort(data)

        res.render('sortByTime.html', {
            songs: data
        })

    })
})

router.get('/sortByPlayNum', function (req, res) {
    Song.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        PlayNumSort(data)

        res.render('sortByPlayNum.html', {
            songs: data
        })

    })
})

router.get('/sortByCommitNum', function (req, res) {
    Song.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        CommitNumSort(data)

        res.render('sortByCommitNum.html', {
            songs: data
        })

    })
})

router.get('/sortBySinger', function (req, res) {
    Song.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        SingerSort(data)

        res.render('sortBySInger.html', {
            songs: data
        })

    })
})

router.get('/search', function (req, res) {
    Song.find(function (err, data) {
        if (err) {
            return res.status(500).send('Server Error !')
        }
        var songs = []
        for (let i = 0; i < data.length; i++) {
            var name = data[i].name;
            var singer = data[i].singer
            if (name.indexOf(req.query.key) + singer.indexOf(req.query.key) > -2) {
                songs.push(data[i])
            }
        }
        res.render('search.html', {
            songs: songs
        })
    })
})

module.exports = router
