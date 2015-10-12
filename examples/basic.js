var enocean=require("../");
var knownSensors={};

enocean.listen("/dev/ttyAMA0")
enocean.on("data",function(data){
	if(knownSensors[data.senderId]!=undefined){
		if(data.learnBit==1){
			var ks=knownSensors[data.senderId]
			var rawVal=((data.raw & ks.eep.bitrange.mask)>>ks.eep.bitrange.shift)
			Rmin=ks.eep.valuerange.min
			Rmax=ks.eep.valuerange.max
			Smin=ks.eep.datarange.min
			Smax=ks.eep.datarange.max
			var val=((Smax-Smin)/(Rmax-Rmin))*(rawVal-Rmin)+Smin
			var st=ks.eep.type+": "+val+ks.eep.unit
			console.log(st)
		}
	}
	if(data.learnBit==0){
		knownSensors[data.senderId]={
			manufacturer:data.manufacturer,
			eepString:data.eep,
			eep:eep_Lookup[data.eep]
		}
	}
});



eep_Lookup={
	"a5-2-14":{
		type:"temperature",
		unit:"°C",
		valuerange:{
			min:255,
			max:0
		},
		bitrange:{
			mask:0b1111111100000000,
			shift:8,
		},
		datarange:{
			min:-20,
			max:60
		}
	}
}
