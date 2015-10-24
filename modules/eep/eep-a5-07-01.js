var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	rawVal = ((parseInt(data,16) & 0xff00)>>>8)
	var pir = (rawVal < 128) ? "off" : "on"
	var i = (parseInt(data,16) & 1)

	val1=Help.extractByteValue(3,0,250,0,5,data)
	vol={
			type:"Voltage",
			unit:"V",
			value: val1
		}
	var contact=["not supported","supported"]

	if(eep==="a5-07-01"){
		ret = [{
			type:"PIR Status",
			unit:"",
			value: pir
		},
		{
			type:"Supply voltage",
			unit:"",
			value: contact[i]
		}
		]
		if(i==1) ret.push(vol)
		return ret
	}
	return ret
}