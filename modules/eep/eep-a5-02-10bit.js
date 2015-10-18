module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="02" && sensors[type]!==undefined){
		rawVal = ((parseInt(data,16) & 0x3FF00)>>>8)
		var Smin       = sensors[type].min
		var Smax       = sensors[type].max
		var val    = ((Smax-Smin)/(0-1023))*(rawVal-1023)+Smin
		ret=[{
			type:"temperature",
			unit:"°C",
			value: val
		}]
		return ret
	}
	return ret
}
var sensors={
20:{min:-10,max:41.2}, //10
30:{min:-40,max:62.3}, //20
}