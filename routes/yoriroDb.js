var Db 			= require('mongodb').Db;
var Connection 	= require ('mongodb').Connection ;
var Server 		= require ('mongodb').Server;
var BSON 		= require ('mongodb').BSON;
var ObjectID 	= require ('mongodb').ObjectID;

YoriroDb = function (host, port) {
    this.db = new Db('yoriro-db', new Server(host, port, {auto_reconnect: true}), {safe:false});
    this.db.open(function(error){
		if (!error){
			console.log ("We are connected");
		}else {
			console.log (error);
		}
    });
}

YoriroDb.prototype.getBlueCollection = function(callback){
    this.db.collection('blue', function(error, collection) {
		if (error) callback(error);
		else callback(null, collection);
	});
};

YoriroDb.prototype.getCharactorInfo = function(callback){
	this.getBlueCollection(function (error, collection) {
		
		if(error)
			callback(error);
		else {
			collection.find().toArray(function(error, result) {
				console.log(result);
				if (error)
					callback (error);
				else{
					if ( result.length == 0 )
						result[0] = { moveSpeed:0,digInterval:0,digDamage:0 };
							
					callback(null, result[result.length-1]);
				}
			});
		}
	});
};

YoriroDb.prototype.saveCharactorInfo = function(id,data,callback){
	this.getBlueCollection(function (error, collection) {
		if (error) callback (error) ;
		else {
			if(id != undefined){
				collection.update({_id: ObjectID.createFromHexString(id)},data,function (error, result){
					if (error)
						callback (error);
					else
						callback(null, result);
				});
			}else{
				collection.insert(data,function (error, result){
					if (error)
						callback (error);
					else
						callback(null, result);
				});
			}
		}
	});
};

YoriroDb.prototype.getStageCollection = function(callback){
    this.db.collection('stage', function(error, collection) {
		if (error) callback(error);
		else callback(null, collection);
	});
};

YoriroDb.prototype.getStageInfo = function(stage,callback){
	this.getStageCollection(function (error, collection) {
		
		if(error)
			callback(error);
		else {
			collection.findOne({stage: stage},function(error, result) {
				
				if (error)
					callback (error);
				else{
					if ( result == null ){
						result ={ 	ariCnt:0,ariSpeed:0,ariStartTime:0,
									pangCnt:0,pangSpeed:0,pangStartTime:0,
									width:0,height:0,mapInfo:"0",stage:stage,
									playTime:0
								};
					}
					// result.mapInfoList = result.mapInfo.split(',\r\n');
					// for(var i=0;i<result.mapInfoList.length;i++){
					// 	result.mapInfoList[i] = result.mapInfoList[i].replace('\r\n','').split(',');
					// }
					callback(null, result);
				}
			});
		}
	});
};

YoriroDb.prototype.saveStageInfo = function(id,data,callback){
	
	this.getStageCollection(function (error, collection) {
		if (error) callback (error) ;
		else {
			if(id != undefined){
				collection.update({_id: ObjectID.createFromHexString(id)},data,function (error, result){
					if (error)
						callback (error);
					else
						callback(null, result);
				});
			}else{
				collection.insert(data,function (error, result){
					if (error)
						callback (error);
					else
						callback(null, result);
				});
			}
		}
	});
};
    
/*
InfoProvider.prototype.findAll = function (callback) {
    this.getCollection(function (error, article_collection) {
		if (error ) callback(error);
		else {
		    article_collection.find().toArray(function(error, results){
				if (error) callback(error);
				else callback(null, results);
			});
	    }
	});
};
		       

InfoProvider.prototype.findById = function(id, callback) {
	this.getCollection(function (error, article_collection) {
		if(error)
			callback(error);
		else {
			article_collection.findOne({_id: ObjectID.createFromHexString(id)}, function(error, result) {
				if (error)
					callback (error);
				else
					callback(null, result);
			});
		}
	});
};


InfoProvider.prototype.addCommentToArticle = function (articleId, comment, callback){
	this.getCollection(function(error, article_collection) {
		if (error) callback (error) ;
		else {
			article_collection.update({
				_id: ObjectID.createFromHexString(articleId)},
				{"$push": {comments: comment}},
				function (error, article){
					if (error ) callback(error);
					else callback (null , article);
			});
		}
	});
}

InfoProvider.prototype.save = function (articles, callback) {

	this.getCollection(function (error, article_collection)  {
		if (error) callback (error);

		else {
			if ( typeof (articles.length)== "undefined")
				articles = [articles];

			for (var i=0;i <articles.length;i++) {
				article = articles[i];
				article.created_at = new Date();

				if (article.comments == undefined)
					article.comments = [];

				for (var j=0; j < article.comments.length ; j++) {
					article.comments[j].created_at = new Date();
				}
			}

			article_collection.insert(articles, function() {
				callback(null, articles);
			});

		}
	});
};
*/
exports.YoriroDb = YoriroDb;

