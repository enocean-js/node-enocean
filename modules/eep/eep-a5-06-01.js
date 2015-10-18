module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep==="a5-06-01"){

		rawVal = ((parseInt(data,16) & 0xff00)>>>8)
		var Smin       = 600
		var Smax       = 60000
		var val1    = ((Smax-Smin)/255)*(rawVal)+Smin
		rawVal = ((parseInt(data,16) & 0xff0000)>>>16)
		Smin       = 300
		Smax       = 30000
		var val2    = ((Smax-Smin)/255)*(rawVal)+Smin
		rawVal = ((parseInt(data,16) & 0xff000000)>>>24)
		Smin       = 0
		Smax       = 5.1
		var val3    = ((Smax-Smin)/255)*(rawVal)+Smin

		var select=((parseInt(data,16) & 1))
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
