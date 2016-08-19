var Help = require("./eepHelper.js")
module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
  if(eep==="a5-12-01"){


		var sst = data.substring(6,8)=="8f"
		var part = parseInt(data.substring(4,6),16)
		var nr1 = data.substring(0,2)
		var nr2 = data.substring(2,4)
		var snr1={
			type:"serialnumber Part1",
			unit:"",
			value:(sst && part==0)?nr1:null
		}
		var snr2={
			type:"serialnumber Part2",
			unit:"",
			value:(sst && part==1)?nr2+""+nr1:null
		}
		var T1=8
    var Unit=""
    var devisor=1
    var value=0
    if(data.substring(6,8)!="8f"){
	    T1=Help.extractBitValue(0,4,4,data)
	    Unit=Help.extractBitEnum(0,2,1,data,["kWh","W"])
	    devisor=Help.extractBitEnum(0,0,2,data,[1,10,100,1000])
	    value=parseInt(data.substring(0,6),16)/devisor
		}
		d1={
			type:"Total Tarif 0",
			unit:"kWh",
			value: (T1==0 && Unit=="kWh")?value:null
		}
		d2={
			type:"Current Tarif 0",
			unit:"W",
			value:(T1==0 && Unit=="W")?value:null
		}
		d3={
			type:"Total Tarif 1",
			unit:"kWh",
			value:(T1==1 && Unit=="kWh")?value:null
		}
		d4={
			type:"Current Tarif 1",
			unit:"W",
			value:(T1==1 && Unit=="W")?value:null
		}

    return [d1,d2,d3,d4,snr1,snr2]
  }
  return null
}
