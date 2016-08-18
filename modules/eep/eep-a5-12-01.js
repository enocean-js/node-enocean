var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
  if(eep==="a5-12-01"){
    if(data.substring(6,8)=="8f"){
      return [{
        type:"serialnumber",
        unit:"",
        value:"ignored"
      }]
    }
    var T1=Help.extractBitValue(0,4,4,data)
    var Unit=Help.extractBitEnum(0,2,1,data,["kWh","W"])
    var devisor=Help.extractBitEnum(0,0,2,data,[1,10,100,1000])
    var value=parseInt(data.substring(0,6),16)/devisor
    return [{
			type:"Power",
			unit:Unit,
			value: value
		},{
      type:"devisor",
      unit:"",
      value:devisor
    },{
      type:"Tarif",
      unit:"",
      value:T1
    }]
  }
  return null
}
