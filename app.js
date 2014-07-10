var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var users = require('./routes/user');
var mapEditor = require('./routes/mapEditor');
var YoriroDb = require('./routes/yoriroDb').YoriroDb;

var yoriroDb = new YoriroDb('1.234.88.24',27017);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', function(req,res){
    res.render('layout',{});        
});

app.get('/charactorInfo', function(req,res){
    yoriroDb.getCharactorInfo(function(error,result){
        if(error){
            console.log(error);
            return;
        }
        res.render('charactorInfo',{ info: result });        
    });
});

app.post('/charactorInfo', function(req,res){
    console.log('post');
    yoriroDb.saveCharactorInfo(req.param('_id'),{
        moveSpeed: req.param('moveSpeed'),
        digDamage: req.param('digDamage'),
        digInterval: req.param('digInterval')
    },function(error,result){
        if(error)
            console.log(error);
        else
            console.log('done');
        res.redirect('/');
    });
});

app.get('/stageMapInfo/:stage', function(req,res){
// app.get('/stageMapInfo', function(req,res){
    yoriroDb.getStageInfo(req.params.stage,function(error,result){
        if(error){
            console.log(error);
            return;
        }
        res.render('stageMapInfo',{ info: result });        
    });
});

app.post('/stageMapInfo', function(req,res){
    console.log('stageMapInfo/post');
    yoriroDb.saveStageInfo(req.param('_id'),
    { 	ariCnt      : req.param('ariCnt'),
        ariSpeed    : req.param('ariSpeed'),
        ariStartTime: req.param('ariStartTime'),
		pangCnt     : req.param('pangCnt'),
		pangSpeed   : req.param('pangSpeed'),
		pangStartTime: req.param('pangStartTime'),
		width       : req.param('width'),
		height      : req.param('height'),
		mapInfo     : req.param('mapInfo'),
		stage       : req.param('stage'),
		playTime    : req.param('playTime')
    },function(error,result){
        if(error)
            console.log(error);
        else
            console.log('done');
        res.redirect('/stageMapInfo/'+req.param('stage'));
    });
});



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT);
module.exports = app;
