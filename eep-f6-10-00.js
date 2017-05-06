module.exports=function(eep,data) {
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type, 16)
	if(eep=="f6-10-00"){
		if(("0x"+data & 0xc0) >>> 6 == 3) {	// all state changes begins with 0b11xxxxxx
			if(("0x"+data & 0x10) >>> 4 == 0) {	// 0b11x0xxxx horizontal
				return [{
					type: "state",
					unit: "",
					value: "handle horizontal"
				}]
			} else {
				if(("0x"+data & 0x20) >>> 5 == 0) {	//0b1101xxxx up
					return [{
						type: "state",
						unit: "",
						value: "handle vertical up"
					}]
				} else {	//0b1111xxxx down
					return [{
						type: "state",
						unit: "",
						value: "handle vertical down"
					}]
				}
			}
		}
	}
	return ret
}