var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="02" && sensors[type]!==undefined){
		val = Help.extract10BitValue(1,1023,0,sensors[type].min,sensors[type].max,data)
		return [{
			type:"temperature",
			unit:"°C",
			value: val
		}]
	}
	return ret
}
var sensors={
20:{min:-10,max:41.2}, //10
30:{min:-40,max:62.3}, //20
}