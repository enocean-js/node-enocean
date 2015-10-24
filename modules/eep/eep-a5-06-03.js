var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep==="a5-06-03"){
		val1=Help.extract10BitValueReverse(2,0,1000,0,1000,data)
		val2=Help.extractByteValue(3,0,250,0,5,data)
		var select=Help.extractBitValue(0,0,1,data)
		


		ret=[{
				type:"illumination",
				unit:"lux",
				value: val1
			},
			{
				type:"voltage",
				unit:"V",
				value: val2
			}]

		return ret
	}
	return ret
}
