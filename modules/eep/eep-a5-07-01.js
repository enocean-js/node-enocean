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

	rawVol = ((parseInt(data,16) & 0xff000000)>>>24)
	var Smin       = 0
	var Smax       = 5.0
	var val1    = ((Smax-Smin)/255)*(rawVol)+Smin
	vol={
			type:"Voltage",
			unit:"V",
			value: val1
		}
	var contact=["not supported","supported"]

	if(eep==="a5-07-01"){
		ret = [{
			type:"Supply voltage",
			unit:"",
			value: contact[i]
		},
		{
			type:"PIR Status",
			unit:"",
			value: pir
		}]
		if(i==1) ret.push(vol)
		return ret
	}
	return ret
}