module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep==="a5-11-02"){

		rawVal = ((parseInt(data,16) & 0xff00)>>>8)
		var Smin       = 0
		var Smax       = 51.2
		var val1    = ((Smax-Smin)/255)*(rawVal)+Smin
		rawVal = ((parseInt(data,16) & 0xff000000)>>>24)
		Smin       = 0
		Smax       = 100
		var val2    = ((Smax-Smin)/255)*(rawVal)+Smin

		var i = ((parseInt(data,16) & 0xff0000)>>>16)
		var fanstages=[]
		fanstages[0]="Stage 0 Manual"
		fanstages[1]="Stage 1 Manual"
		fanstages[2]="Stage 2 Manual"
		fanstages[3]="Stage 3 Manual"
		fanstages[16]="Stage 0 Automatic"
		fanstages[17]="Stage 1 Automatic"
		fanstages[18]="Stage 2 Automatic"
		fanstages[19]="Stage 3 Automatic"
		fanstages[255]="Not Available"

		i1=(parseInt(data,16) & 4)>>>2
		NRG= ["Normal","Energy hold-off/Dew point"]

		i2=(parseInt(data,16) & 3)
		occu= ["Occupied","Unoccupied","StandBy","Frost"]

		i3=(parseInt(data,16) & 16)>>>4
		CState= ["Automatic","Override"]

		i4=(parseInt(data,16) & 128)>>>7
		Alarm= ["No alarm","Alarm"]

		i5=(parseInt(data,16) & 96)>>>6
		mode= ["Heating","Cooling","Off"]

		ret=[{
			type:"Setpoint Temperature",
			unit:"°C",
			value: val1
		},{
			type:"Controller Value",
			unit:"%",
			value: val2
		},{
			type:"Fan Stage",
			unit:"",
			value: fanstages[i]
		},{
			type:"Occupancy",
			unit:"",
			value: occu[i2]
		},{
			type:"Energy hold-off",
			unit:"",
			value: NRG[i1]
		},{
			type:"Controller State",
			unit:"",
			value: CState[i3]
		},{
			type:"Alarm",
			unit:"",
			value: Alarm[i4]
		},{
			type:"Controller mode",
			unit:"",
			value: mode[i5]
		}]
		return ret
	}
	return ret
}
