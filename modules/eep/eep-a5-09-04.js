var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="09" && typeNr==4){
		var val3 = Help.extractByteValue(3,0,200,0,100,data)
		var val2 = Help.extractByteValue(2,0,255,0,2550,data)
		var val1 = Help.extractByteValue(1,0,255,0,51,data)

		ret=[
      {
				type:"Humidity",
				unit:"%",
				value: val3
			},{
				type:"Concentration",
				unit:"ppm",
				value: val2
			},{
				type:"Temperature",
				unit:"°C",
				value: val1
			}
    ]
		return ret
	}
  return null
}
