module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="04" && sensors[type]!==undefined){

		rawVal = ((parseInt(data,16) & 0xff00)>>>8)
		var Smin       = sensors[type].tmin
		var Smax       = sensors[type].tmax
		var val1    = ((Smax-Smin)/255)*(rawVal)+Smin
		rawVal = ((parseInt(data,16) & 0xff0000)>>>16)
		Smin       = sensors[type].hmin
		Smax       = sensors[type].hmax
		var val2    = ((Smax-Smin)/255)*(rawVal)+Smin
		if((parseInt(data,16) & 2)===2) {
			ret=[{
				type:"temperature",
				unit:"°C",
				value: val1
			},{
				type:"humidity",
				unit:"%rF",
				value: val2
			}]
		}else{
			ret=[{
				type:"humidity",
				unit:"%rF",
				value: val2
			}]
		}
		return ret
	}
	return ret
}
var sensors={
"01":{hmin:0,hmax:100,tmin:0,tmax:40}, //1
"02":{hmin:0,hmax:100,tmin:-20,tmax:60}//2
}