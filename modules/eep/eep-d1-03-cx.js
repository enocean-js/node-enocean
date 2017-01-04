var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="d1" && func==="03" && type[0]=="c" && type[1]<3){
		type=data.substring(2,4)
		function convert(x){
			if(type=="c1"){
				return (x*127.5)/255 -20
			}else{
				return (x*85)/255
			}
		}
		var val11=convert(parseInt(data.substring(4,6),16))
		var val12=convert(parseInt(data.substring(6,8),16))
		var val13=convert(parseInt(data.substring(8,10),16))
		var val21=convert(parseInt(data.substring(10,12),16))
		var val22=convert(parseInt(data.substring(12,14),16))
		var val23=convert(parseInt(data.substring(14,16),16))
		var val31=convert(parseInt(data.substring(16,18),16))
		var val32=convert(parseInt(data.substring(18,20),16))
		var val33=convert(parseInt(data.substring(20,22),16))
		var valInt=convert(parseInt(data.substring(22,24),16))
		var status=parseInt(data.substring(24,26),16)
		var ps=status & 1
		var bs=(status & 2)>>>1
		var st=(status & 48)>>>4
		var times=[10,20,30,100]
		return [{
			type:"Temperature Ch1 (1)",
			unit:"°C",
			value: val11
		},{
			type:"Temperature Ch1 (2)",
			unit:"°C",
			value: val12
		},{
			type:"Temperature Ch1 (3)",
			unit:"°C",
			value: val13
		},{
			type:"Temperature Ch2 (1)",
			unit:"°C",
			value: val21
		},{
			type:"Temperature Ch2 (2)",
			unit:"°C",
			value: val22
		},{
			type:"Temperature Ch2 (3)",
			unit:"°C",
			value: val23
		},{
			type:"Temperature Ch3 (1)",
			unit:"°C",
			value: val31
		},{
			type:"Temperature Ch3 (2)",
			unit:"°C",
			value: val32
		},{
			type:"Temperature Ch3 (3)",
			unit:"°C",
			value: val33
		},{
			type:"Temperature internal",
			unit:"°C",
			value: valInt
		},{
			type:"Power Source",
			unit:"",
			value: ps==0?"battery":"solar"
		},{
			type:"Battery Status",
			unit:"",
			value: bs==0?"low":"normal"
		},{
			type:"Sample Time",
			unit:"s",
			value: times[st]
		},{
			type:"Range",
			unit:"°C",
			value: type=="c1"?"-20 to +100":"0 to +85"
		},]
	}
	return ret
}
