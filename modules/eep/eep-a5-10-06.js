var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	if(eep==="a5-10-06"){
    var tmp=Help.extractByteValue(1,255,0,0,40,data)
    var sp=Help.extractByteValue(2,0,255,0,255,data)
    var oc=Help.extractBitEnum(0,0,1,["OFF","ON"],data)
		return [{
			type:"Temperature",
			unit:"°C",
			value: tmp
		},{
			type:"Setpoint",
			unit:"",
			value: sp
		},{
			type:"Slide Switch",
			unit:"",
			value: oc
		}]
	}
	return ret
}
