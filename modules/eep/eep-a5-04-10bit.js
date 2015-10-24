var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="04" && sensors[type]!==undefined){
		var val1 = Help.extract10BitValue(1,0,1023,sensors[type].tmin,sensors[type].tmax,data)
		var val2 = Help.extractByteValue(3,0,255,sensors[type].hmin,sensors[type].hmax,data)
		var trg= Help.extractBitEnum(0,1,1,data,["heartbeat","event"])
			ret=[{
				type:"temperature",
				unit:"°C",
				value: val1
			},{
				type:"humidity",
				unit:"%rF",
				value: val2
			},{
				type: "trigger",
				value: trg,
				unit:""
			}]
		return ret
	}
	return ret
}

var sensors={
"03":{hmin:0,hmax:100,tmin:-20,tmax:60} //1
}