var array = [];

var rasname = process.env.RASPI_NAME;

var MongoClient = require('mongodb').MongoClient
	,assert = require('assert')
	,average = require('./beacon-average');

var addDatabase = function(data){
	var url = 'mongodb://150.89.234.253:27017/myproject-room';
	MongoClient.connect(url, function(err, db){
		var collection = db.collection('beacons');
		collection.insertMany(data, function(err, result){});
		assert.equal(err, null);
	});
}

Bleacon = require('bleacon');
Bleacon.startScanning();
Bleacon.on('discover',function(bleacon){
	array.push(bleacon);
});

var avetime = function(){
	var tmp = array;
	array = [];

	if(tmp.length == 0){
		return;
	}

result = average.calcRssiAverages(tmp);
console.log(result);
var data = [];
var time = new Date();
for(var i = 0;i<result.length;i++){
    var dist = Math.pow(10,(result[i].measuredPower - result[i].averageRssi) / 20);
        data.push({receiver : rasname, minor : result[i].minor, date : time, 強度 : result[i].averageRssi, 距離 : dist});
}

//mongoDBに送信	
	addDatabase(data);

}

setInterval(avetime,5000);

