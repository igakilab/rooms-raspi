var array = [];

var rasname = process.env.RASPI_NAME;

var MongoClient = require('mongodb').MongoClient
	,assert = require('assert');

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
	var beacon101 = 0; beacon101C = 0;
	var beacon102 = 0; beacon102C = 0;
	for(var i = 0; i < tmp.length; i++){
		if(tmp[i].minor == 101){
			beacon101 += tmp[i].rssi;
			beacon101C++;
		}else{
			beacon102 += tmp[i].rssi;
			beacon102C++;
		}
	}

	var measuredPower = tmp[0].measuredPower
	var ave101 = beacon101 / beacon101C;
	var ave102 = beacon102 / beacon102C;
	var dist101 = Math.pow(10,(measuredPower - ave101) / 20);
	var dist102 = Math.pow(10,(measuredPower - ave102) / 20);
	var time = new Date();
	
//mongoDBに送信	
	addDatabase([
		{receiver : rasname, minor : 101 , date :  time,  強度 : ave101, 距離 : dist101},
		{receiver : rasname, minor : 102 , date :  time,  強度 : ave102, 距離 : dist102}
	]);
	
	console.log('101 = ' + ave101);
	console.log('距離 : ' + dist101);
	console.log('102 = ' + ave102);
	console.log('距離 : ' + dist102);
}

setInterval(avetime,5000);

