var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="04" && sensors[type]!==undefined){
		var val1 = Help.extractByteValue(1,0,250,sensors[type].tmin,sensors[type].tmax,data)
		var val2 = Help.extractByteValue(2,0,250,sensors[type].hmin,sensors[type].hmax,data)
		var tempavail= Help.extractBitValue(0,1,1,data)
		if(tempavail) {
			ret=[{
				type:"humidity",
				unit:"%rF",
				value: val2
			},{
				type:"temperature",
				unit:"°C",
				value: val1
			}]
		}else{
			ret=[{
				type:"humidity",
				unit:"%rF",
				value: val2
			}]
		}
		return ret
	}
	return ret
}
var sensors={
"01":{hmin:0,hmax:100,tmin:0,tmax:40}, //1
"02":{hmin:0,hmax:100,tmin:-20,tmax:60}//2
}