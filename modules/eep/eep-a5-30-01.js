module.exports=function(eep,data){
	var ret=null	
	if(eep==="a5-30-01"){
    var bat=parseInt(data.substring(2,4),16)
  	var con=parseInt(data.substring(4,6),16)
    var contact = (con >= 196) ? "open":"closed"
    var battery = (bat >= 121) ? "OK":"LOW"

		return [{
			type:"Contact",
			unit:"",
			value: contact
		},{
			type:"Battery Status",
			unit:"",
			value: battery
		}]
	}
	return ret
}
