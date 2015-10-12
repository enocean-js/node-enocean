var BitArray=require("node-bitarray")
var base=0xffa98700

var Manufacturer_List=['MANUFACTURER_RESERVED' ,'PEHA','THERMOKON','SERVODAN','ECHOFLEX_SOLUTIONS','OMNIO_AG','HARDMEIER_ELECTRONICS','REGULVAR_INC',
'AD_HOC_ELECTRONICS','DISTECH_CONTROLS','KIEBACK_AND_PETER','ENOCEAN_GMBH',
'PROBARE','ELTAKO','LEVITON','HONEYWELL','SPARTAN_PERIPHERAL_DEVICES','SIEMENS','T_MAC','RELIABLE_CONTROLS_CORPORATION',
'ELSNER_ELEKTRONIK_GMBH','DIEHL_CONTROLS','BSC_COMPUTER','S_AND_S_REGELTECHNIK_GMBH','MASCO_CORPORATION','INTESIS_SOFTWARE_SL','VIESSMANN','LUTUO_TECHNOLOGY',
'SCHNEIDER_ELECTRIC','SAUTER','BOOT_UP','OSRAM_SYLVANIA','UNOTECH','ELTA_CONTROLS_INC','UNITRONIC_AG','NANOSENSE',
'THE_S4_GROUP','MSR_SOLUTIONS','GE','MAICO','RUSKIN_COMPANY','MAGNUM_ENERGY_SOLUTIONS','KMC_CONTROLS','ECOLOGIX_CONTROLS',
'TRIO_2_SYS','AFRISO_EURO_INDEX','NEC_ACCESSTECHNICA_LTD','ITEC_CORPORATION','SIMICX_CO_LTD','EUROTRONIC_TECHNOLOGY_GMBH','ART_JAPAN_CO_LTD','TIANSU_AUTOMATION_CONTROL_SYSTE_CO_LTD',
'GRUPPO_GIORDANO_IDEA_SPA','ALPHAEOS_AG','TAG_TECHNOLOGIES','CLOUD_BUILDINGS_LTD','GIGA_CONCEPT','SENSORTEC','JAEGER_DIREKT','AIR_SYSTEM_COMPONENTS_INC']


module.exports=function enocean_Telegram(data){
	this.loadFromBuffer=function(buf){
		this.rawByte=buf.toString("hex")
		var startByte=0x55
		var dataLength=buf[2]
		var optionalLength=buf[3]
		this.packetType=buf[4]
		var headerCRC=buf[5]
		var rawDataByte=buf.slice(6,dataLength+6)
		
		this.senderId=buf.slice(dataLength+1,dataLength+5).toString("hex")
		this.choice=buf[6].toString(16)
		switch(this.choice.toString(16)){
			case "a5":
			this.packetTypeString="4BS"
			var rawPayloadBin=BitArray.fromBuffer(buf.slice(7,11))
			this.learnBit=BitArray.fromDecimal(buf[10]).get(3)
			this.raw=BitArray.toNumber(rawPayloadBin.slice(0,32).reverse())
			if(this.learnBit==0){
				var func=BitArray.toHexadecimal(rawPayloadBin.slice(0,6).reverse());
				var type=BitArray.toHexadecimal(rawPayloadBin.slice(6,13).reverse());
				this.eep="a5-"+func+"-"+type;
				var MANUFACTURERID=BitArray.toHexadecimal(rawPayloadBin.slice(13,24).reverse());
				this.manufacturer=Manufacturer_List[MANUFACTURERID]
			}
			break;
			case "f6":
			this.packetTypeString="RPS"
			break;
			case "d5":
			this.packetTypeString="1BS"
			break;
			
		}
		}
	this.toString=function(){
		var st="rawData: "+this.rawDataByte.toString("hex")
		st+="\nPacketType:"+this.packetType.toString(16)
		st+="\nChoice:"+this.choice.toString(16)
		st+="\nLernBit:"+this.learnBit
		//st+="\nBin:"+this.rawPayloadBin
		return st }
	}
