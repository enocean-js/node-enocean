module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep=="a5-05-01"){
		rawVal = ((parseInt(data,16) & 0x3ff0000)>>>16)
		var Smin       = sensors[type].tmin
		var Smax       = sensors[type].tmax
		var val1    = ((Smax-Smin)/1023)*(rawVal)+Smin
		var trigger = "heartbeat"
		if((parseInt(data,16) & 2)===2) trigger = "event"
			ret=[{
				type:"barometric pressure",
				unit:"hPa",
				value: val1
			},{
				type: "trigger",
				value: trigger,
				unit:""
			}]
		return ret
	}
	return ret
}

var sensors={
"01":{min:500,max:1150} //1
}