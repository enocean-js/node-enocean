function getSingleValue(data){
	var rawVal = ((data.raw & this.bitrange.mask)>>this.bitrange.shift)
	Rmin       = this.valuerange.min
	Rmax       = this.valuerange.max
	Smin       = this.datarange.min
	Smax       = this.datarange.max
	var val    = ((Smax-Smin)/(Rmax-Rmin))*(rawVal-Rmin)+Smin
	return {value:val,type:this.type,unit:this.unit}
}

module.exports = {
	"a5-2-14":{
		type:"temperature",
		unit:"°C",
		valuerange:{
			min:255,
			max:0
		},
		bitrange:{
			mask:parseInt("1111111100000000",2),
			shift:8,
		},
		datarange:{
			min:-20,
			max:60
		},
		getValue:getSingleValue,
	}
}

