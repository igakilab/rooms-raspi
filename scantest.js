var array = [];

var rasname = process.env.RASPI_NAME;

var MongoClient = require('mongodb').MongoClient
	,assert = require('assert')
	,average = require('./beacon-average');

var Bleacon = require('bleacon');


function main(){
	//RASPI名がちゃんと設定されているか確認
	if( rasname ){
		console.log("rasname: " + rasname);
	}else{
		console.error("raspi名が指定されていません");
		return;
	}

	Bleacon.startScanning();
	Bleacon.on('discover', function(bleacon){
		array.push(bleacon);
	});
	console.log("Start scanning...");

	setInterval(avetime,5000);
}


function addDatabase(data){
	var url = "mongodb://150.89.234.253:27017/myproject-room";
	MongoClient.connect(url, function(err, db){
		assert.equal(err, null);
		var collection = db.collection('beacons');
		collection.insertMany(data, function(err, result){});
	});
}


function avetime(){
	var tmp = array;
	array = [];

	if( tmp.length == 0 ){
		return;
	}

	result = average.calcRssiAverages(tmp);
	var data = [];
	var time = new Date();
	console.log("-------  " + time.toLocaleString() + "  --------------");
	for(var i = 0; i<result.length; i++){
		var dist = Math.pow(10, (result[i].measuredPower - result[i].averageRssi) / 20);
		console.log("beaconid: " + result[i].minor + " rssi: " + result[i].averageRssi + " distance: " + dist);
		data.push({receiver: rasname, minor: result[i].minor, date: time, 強度: result[i].averageRssi, 距離: dist});
	}

	//mongoDBに送信
	addDatabase(data);
}

main();
