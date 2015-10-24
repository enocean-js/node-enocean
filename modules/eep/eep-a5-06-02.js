var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep==="a5-06-02"){
		val1=Help.extractByteValue(1,0,255,0,1020,data)
		val2=Help.extractByteValue(2,0,255,0,510,data)
		val3=Help.extractByteValue(3,0,255,0,5.1,data)
		var select=Help.extractBitValue(0,0,1,data)
		if(select==0){
			obj={
				type:"illumination",
				unit:"lux",
				value: val1
			}
		}else{
			obj={
				type:"illumination",
				unit:"lux",
				value: val2
			}
		}

		ret=[obj,{
			type:"voltage",
			unit:"V",
			value: val3
		}]

		return ret
	}
	return ret
}
