module.exports=function(eep,data){
	var ret=null
	var eepa=eep.split("-")
	var choice=eepa[0]
	var func=eepa[1]
	var type=eepa[2]
	var typeNr=parseInt(type,16)

	var i = (parseInt(data,16) & 1)
	var contact=["open","closed"]
	if(eep==="d5-00-01"){
		return [{
			type:"Contact",
			unit:"",
			value: contact[i]
		}]
	}
	return ret
}