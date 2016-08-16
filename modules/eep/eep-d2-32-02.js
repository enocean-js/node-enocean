var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="d2" && func==="32" && type==2){
	   var rawVal1=parseInt(data.substring(2,5),16)
	   var rawVal2=parseInt(data.substring(5,8),16)
	   var rawVal3=parseInt(data.substring(8,11),16)
     var powerFailBit=Help.extractBitValue(0,7,1,data.substring(0,2))
     var scaleBit=Help.extractBitValue(0,6,1,data.substring(0,2))
     var devisor=1
     if(scaleBit==1){devisor=10}
		return [{
			type:"scale",
			unit:"",
			value: 1/devisor
		},{
			type:"Current",
			unit:"A",
			value: rawVal1/devisor
		},{
			type:"Current",
			unit:"A",
			value: rawVal2/devisor
		},{
			type:"Current",
			unit:"A",
			value: rawVal3/devisor
		},{
			type:"Power Fail",
			unit:"",
			value: powerFailBit
		}]
	}
	return ret
}
