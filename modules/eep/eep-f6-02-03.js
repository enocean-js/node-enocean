module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)
	if(eep=="f6-02-03"){
		if(data=="30"){
			return [{
				type:"state",
				unit:"",
				value: "A0 down"
			}]
		}
		if(data=="10"){
			return [{
				type:"state",
				unit:"",
				value: "A1 down"
			}]
		}
		if(data=="70"){
			return [{
				type:"state",
				unit:"",
				value: "B0 down"
			}]
		}
		if(data=="50"){
			return [{
				type:"state",
				unit:"",
				value: "B1 down"
			}]
		}
		if(data=="00"){
			return [{
				type:"state",
				unit:"",
				value: "released"
			}]
		}
	}
	return ret
}