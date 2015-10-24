var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep=="a5-05-01"){
		var val1 = Help.extract10BitValue(1,0,1023,500,1150,data)
		var trigger = "heartbeat"
		var trg= Help.extractBitEnum(0,1,1,data,["heartbeat","event"])
			ret=[{
				type:"barometric pressure",
				unit:"hPa",
				value: val1
			},{
				type: "trigger",
				value: trg,
				unit:""
			}]
		return ret
	}
	return ret
}
