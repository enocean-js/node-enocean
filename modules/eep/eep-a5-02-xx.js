var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(choice==="a5" && func==="02" && sensors[type]!==undefined){
		val = Help.extractByteValue(1,255,0,sensors[type].min,sensors[type].max,data)
		return [{
			type:"Temperature",
			unit:"°C",
			value: val
		}]
	}
	return ret
}

var sensors={
"01":{min:-40,max:0}, //1
"02":{min:-30,max:10}, //2
"03":{min:-20,max:20}, //3
"04":{min:-10,max:30}, //4
"05":{min:-0,max:40}, //5
"06":{min:10,max:50}, //6
"07":{min:20,max:60}, //7
"08":{min:30,max:70}, //8
"09":{min:40,max:80}, //9
"0a":{min:50,max:90}, //a
"0b":{min:60,max:100}, //b
"10":{min:-60,max:20}, //10
"11":{min:-50,max:30}, //11
"12":{min:-40,max:40}, //12
"13":{min:-30,max:50}, //13
"14":{min:-20,max:60}, //14
"15":{min:-10,max:70}, //15
"16":{min:0,max:80}, //16
"17":{min:10,max:90}, //17
"18":{min:20,max:100}, //18
"19":{min:30,max:110}, //19
"1a":{min:40,max:120}, //1a
"1b":{min:50,max:130} //1b
}

