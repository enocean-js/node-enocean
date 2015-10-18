module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="04" && sensors[type]!==undefined){
		rawVal = ((parseInt(data,16) & 0x3ff00)>>8)
		var Smin       = sensors[type].tmin
		var Smax       = sensors[type].tmax
		var val1    = ((Smax-Smin)/1023)*(rawVal)+Smin
		rawVal = ((parseInt(data,16) & 0xff000000)>>24)
		Smin       = sensors[type].hmin
		Smax       = sensors[type].hmax
		var val2    = ((Smax-Smin)/255)*(rawVal)+Smin
		var trigger = "heartbeat"
		if((parseInt(data,16) & 2)===2) trigger = "event"
			ret=[{
				type:"temperature",
				unit:"°C",
				value: val1
			},{
				type:"humidity",
				unit:"%rF",
				value: val2
			},{
				type: "trigger",
				value: trigger
			}]
		return ret
	}
	return ret
}

var sensors={
"03":{hmin:0,hmax:100,tmin:0,tmax:40} //1
}