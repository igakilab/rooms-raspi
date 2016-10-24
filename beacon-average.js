var _module = {};

/*
 * 対象の値がundefinedからnullならば、trueを返します
 */
_module.isNull = function(value){
  return typeof value === 'undefined' || value === null;
}

/*
 * ビーコンのレコードデータとリザルトデータを比較して、
 * 同じビーコンのデータかどうかを判定します
 */
_module.beaconEquals = function(beacon, result){
  return beacon.minor == result.minor;
}

/*
 * results配列の中からおなじbeaconに与えられたレコードデータ
 * と同じビーコンのデータの位置を返します
 * 見つからなかった場合は-1が返却されます
 */
_module.searchBeaconResultData = function(results, beacon){
  for(var i=0; i<results.length; i++){
    if( this.beaconEquals(beacon, results[i]) ){
      return i;
    }
  }
  return -1;
}

/*
 * 基本となるリザルトデータを生成します。
 * この関数からデータを生成することで、共通したビーコンデータを
 * もたせることができます。
 */
_module.createResultObject = function(beacon){
  return {minor: beacon.minor};
}

/*
 * ビーコンの信号強度であるrssiを生成します
 * そのビーコンにおいて一番最初に登場するレコードに
 * measuredPowerが指定されている場合は、その値もリザルトデータに
 * 格納します。
 */
_module.calcRssiAverages = function(beacons){
  var results = [];

  for(var i=0; i<beacons.length; i++){
    //rssi値がnullのデータは無視する
    if( !this.isNull(beacons[i].rssi) ){
      //resultsに同じビーコンのデータがないか検索
      var idx = this.searchBeaconResultData(results, beacons[i]);

      //同じデータがない場合はここで初期化する
      var tmp;
      if( idx < null ){
        tmp = this.createResultObject(beacons[i]);
        tmp.sumRssi = 0;
        tmp.count = 0;
        if( !this.isNull(beacons[i].measuredPower) ){
          tmp.measuredPower = beacons[i].measuredPower;
        }
        results.push(tmp);
      }else{
        tmp = results[idx];
      }

      //値を加算する
      tmp.sumRssi += beacons[i].rssi;
      tmp.count++;
    }
  }

  //平均値を計算する
  for(var i=0; i<results.length; i++){
    var tmp = results[i];
    tmp.averageRssi = tmp.sumRssi / tmp.count;
  }

  return results;
}

module.exports = _module;
