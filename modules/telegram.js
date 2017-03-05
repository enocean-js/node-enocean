// 	   This file is part of node-enocean.

//     node-enocean. is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     node-enocean. is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with node-enocean.  If not, see <http://www.gnu.org/licenses/>.



//     # EnOcean ESP 3.0 implementation
//     this module extracts basic info from telegrams which are passed here as a Buffer
var M=[]
M[0x000]="MANUFACTURER_RESERVED"
M[0x001]="PEHA"
M[0x002]="THERMOKON"
M[0x003]="SERVODAN"
M[0x004]="ECHOFLEX_SOLUTIONS"
M[0x005]="OMNIO_AG"
M[0x006]="HARDMEIER_ELECTRONICS"
M[0x007]="REGULVAR_INC"
M[0x008]="AD_HOC_ELECTRONICS"
M[0x009]="DISTECH_CONTROLS"
M[0x00A]="KIEBACK_AND_PETER"
M[0x00B]="ENOCEAN_GMBH"
M[0x00C]="PROBARE"
M[0x00D]="ELTAKO"
M[0x00E]="LEVITON"
M[0x00F]="HONEYWELL"
M[0x010]="SPARTAN_PERIPHERAL_DEVICES"
M[0x011]="SIEMENS"
M[0x012]="T_MAC"
M[0x013]="RELIABLE_CONTROLS_CORPORATION"
M[0x014]="ELSNER_ELEKTRONIK_GMBH"
M[0x015]="DIEHL_CONTROLS"
M[0x016]="BSC_COMPUTER"
M[0x017]="S_AND_S_REGELTECHNIK_GMBH"
M[0x018]="MASCO_CORPORATION"
M[0x019]="INTESIS_SOFTWARE_SL"
M[0x01A]="VIESSMANN"
M[0x01B]="LUTUO_TECHNOLOGY"
M[0x01C]="SCHNEIDER_ELECTRIC"
M[0x01D]="SAUTER"
M[0x01E]="BOOT_UP"
M[0x01F]="OSRAM_SYLVANIA"
M[0x020]="UNOTECH"
M[0x21]="DELTA_CONTROLS_INC"
M[0x022]="UNITRONIC_AG"
M[0x023]="NANOSENSE"
M[0x024]="THE_S4_GROUP"
M[0x025]="MSR_SOLUTIONS"
M[0x26]="GE"
M[0x027]="MAICO"
M[0x28]="RUSKIN_COMPANY"
M[0x29]="MAGNUM_ENERGY_SOLUTIONS"
M[0x02A]="KMC_CONTROLS"
M[0x02B]="ECOLOGIX_CONTROLS"
M[0x2C]="TRIO_2_SYS"
M[0x02D]="AFRISO_EURO_INDEX"
M[0x030]="NEC_ACCESSTECHNICA_LTD"
M[0x031]="ITEC_CORPORATION"
M[0x32]="SIMICX_CO_LTD"
M[0x34]="EUROTRONIC_TECHNOLOGY_GMBH"
M[0x35]="ART_JAPAN_CO_LTD"
M[0x36]="TIANSU_AUTOMATION_CONTROL_SYSTE_CO_LTD"
M[0x38]="GRUPPO_GIORDANO_IDEA_SPA"
M[0x39]="ALPHAEOS_AG"
M[0x3A]="TAG_TECHNOLOGIES"
M[0x3C]="PRESSAC"
M[0x3E]="GIGA_CONCEPT"
M[0x3F]="SENSORTEC"
M[0x40]="JAEGER_DIREKT"
M[0x41]="AIR_SYSTEM_COMPONENTS_INC"
M[0x46]="NODON"
M[0x7F]="MULTI_USER_MANUFACTURER"
var Manufacturer_List = M
// [ // the List of Manufacturers. the index is equal to the number transmitted in learn telegrams
// 	'MANUFACTURER_RESERVED' ,'PEHA','THERMOKON','SERVODAN','ECHOFLEX_SOLUTIONS','OMNIO_AG','HARDMEIER_ELECTRONICS','REGULVAR_INC','AD_HOC_ELECTRONICS',
// 	'DISTECH_CONTROLS','KIEBACK_AND_PETER','ENOCEAN_GMBH','PROBARE','ELTAKO','LEVITON','HONEYWELL','SPARTAN_PERIPHERAL_DEVICES','SIEMENS','T_MAC',
// 	'RELIABLE_CONTROLS_CORPORATION','ELSNER_ELEKTRONIK_GMBH','DIEHL_CONTROLS','BSC_COMPUTER','S_AND_S_REGELTECHNIK_GMBH','MASCO_CORPORATION','INTESIS_SOFTWARE_SL',
// 	'VIESSMANN','LUTUO_TECHNOLOGY','SCHNEIDER_ELECTRIC','SAUTER','BOOT_UP','OSRAM_SYLVANIA','UNOTECH','ELTA_CONTROLS_INC','UNITRONIC_AG','NANOSENSE',
// 	'THE_S4_GROUP','MSR_SOLUTIONS','GE','MAICO','RUSKIN_COMPANY','MAGNUM_ENERGY_SOLUTIONS','KMC_CONTROLS','ECOLOGIX_CONTROLS','TRIO_2_SYS','AFRISO_EURO_INDEX',
// 	'NEC_ACCESSTECHNICA_LTD','ITEC_CORPORATION','SIMICX_CO_LTD','EUROTRONIC_TECHNOLOGY_GMBH','ART_JAPAN_CO_LTD','TIANSU_AUTOMATION_CONTROL_SYSTE_CO_LTD',
// 	'GRUPPO_GIORDANO_IDEA_SPA','ALPHAEOS_AG','TAG_TECHNOLOGIES','CLOUD_BUILDINGS_LTD','GIGA_CONCEPT','SENSORTEC','JAEGER_DIREKT','AIR_SYSTEM_COMPONENTS_INC'
// 	]

module.exports = function enocean_Telegram( ) {
	this.timestamp = Date.now()
	this.loadFromBuffer    = function( buf ) {
		this.rawByte       = buf.toString( "hex" ) // store the original Buffer as a string in .rawByte
		var dataLength     = 255 * buf[ 1 ] + buf[ 2 ] // length of the Data Part of the telegram
		var optionalLength = buf[ 3 ] // length of the optional data part of the telegram
		this.packetType    = buf[ 4 ] // packet type ( 1=radio telegram , 2=response... )
		var headerCRC      = buf[ 5 ] // checksum of the header
		var rawDataByte    = buf.slice( 7 , dataLength + 7 ) // Data byte start at Byte 7 and end at 6 + dataLength
		

		switch( this.packetType ) {
			case 2 :
				// RESPONSES are not really supportet yet (2.0?) the only propper use here is for getting the base address
				this.packetTypeString = "RESPONSE"
				this.returnCode       = buf[ 6 ]
				var rc_string         = [ "RET_OK" , "RET_ERROR" , "RET_NOT_SUPPORTED" , "RET_WRONG_PARAM" , "RET_OPERATION_DENIED" ]
				if( this.returnCode   < 128 ) { this.returnCodeString = rc_string[ this.returnCode ] }
				if( dataLength       == 5 ) {
				// not really correct, but for now assume that RESPNSES with a length of 5 contain the base address
					this.base         = buf.slice( 7 , 11 ).toString( "hex" )
				}
				this.raw              = rawDataByte
			break
			case 1 :
				// this is a RADIO telegram. senderId and choice are part of every radio telegram
				this.senderId         = buf.slice( dataLength + 1 , dataLength + 5 ).toString( "hex" ) // should we rename this to sensorId? needs a bit of refactoring...
				this.choice           = buf[ 6 ].toString( 16 ) // choice equals the RORG. for now 4BS (a5), RPS(f6) and 1BS(d5) are supported
				switch( this.choice ) {
					case "a5" :
						// this is a 4BS (4 Byte Communication) Telegram. the data part is 4 bytes long
						this.packetTypeString  = "4BS"
						this.raw               = pad( buf.slice( 7 , 11 ).toString( "hex" ) , 8 ) // the data part as a hex string
						var rawNr              = parseInt( buf.slice( 7 , 11 ).toString( "hex" ) , 16 ) // the data part as decimal number
						//extract the learn bit
						// Bit 3 (so the 4th Bit) (0b1000=8) is the learnBit. if it is 0 (f.e. 10111) then this is a learn telegram
						this.learnBit          = ( rawNr & 8 ) >>> 3
						// allways use zero fill bit shifts to prevent accidetial negative numbers, because in js INTs are signed
						if( this.learnBit     == 0 ) {
							 // the following extractions could be written shorter, but this way ist more clear what goes on
							var func           = ( ( parseInt( "11111100000000000000000000000000" , 2 ) & rawNr ) >>> 26 ).toString( 16 ) // in the first 6 bits the func part of the eep is stored
							var type           = ( ( parseInt( "00000011111110000000000000000000" , 2 ) & rawNr ) >>> 19 ).toString( 16 ) // in the next 7 bits the type part of the eep can be found
							var MANUFACTURERID = (   parseInt( "00000000000001111111111100000000" , 2 ) & rawNr ) >>> 8 // the next 11 bit contain the manufacturer id, leaving 8 bits (Byte0 of the telegram unused)
							// convert the eep into a string of the form "a5-ff-tt" where ff is the func in hex and tt is the type in hex
							// pad the values with leading zeros so the numbers are allways 2 digits
							this.eep           = "a5-" + pad( func , 2 ) + "-" + pad( type , 2 )
							this.manufacturer  = Manufacturer_List[ MANUFACTURERID ] // look up the name of the manufacturer
						}
					break
					case "f6" :
					// this is an RPS Packet. It just contains 1 data byte, there is no learnBit
						this.raw               = pad( buf[ 7 ].toString( 16 ), 2 ) // extract the data byte (Byte0) as a padded hex string
						this.packetTypeString  = "RPS" // its an RPS telegram (rocker switch)
					break
					case "d5" :
					// this is a 1BS telegram. it also contains only one data byte, but it also carries a learn bit
						this.raw               = pad( buf[ 7 ].toString( 16 ) , 2 ) // extract the data byte (Byte0) as a padded hex string
						// Bit 3 (so the 4th Bit) (0b1000=8) is the learnBit. if it is 0 (f.e. 10111) then this is a learn telegram
						this.learnBit          = ( parseInt( this.raw , 16 ) & 8 ) >>> 3
						this.packetTypeString  = "1BS"
					break
					case "d2" :
					// this is a VLD telegram.
						this.raw               = pad(rawDataByte.toString("hex"),dataLength*2 )// extract the data byte (Byte0) as a padded hex string
						// Bit 3 (so the 4th Bit) (0b1000=8) is the learnBit. if it is 0 (f.e. 10111) then this is a learn telegram
						this.learnBit          = 1
						this.packetTypeString  = "VLD"
					break
					case "d1" :
					// this is a MSC telegram.
						this.raw               = pad(rawDataByte.toString("hex"),dataLength*2 )// extract the data byte (Byte0) as a padded hex string
						// Bit 3 (so the 4th Bit) (0b1000=8) is the learnBit. if it is 0 (f.e. 10111) then this is a learn telegram
						this.learnBit          = rawDataByte[dataLength-1] & 8
						if(this.learnBit==0){
							var func = pad(rawDataByte[0].toString(16),2)
							var type = pad(rawDataByte[1].toString(16),2)
							this.eep = `d1-${func}-${type}`
							this.manufacturerid=parseInt("0x"+func+""+type[0])
							this.manufacturer=Manufacturer_List[parseInt("0x"+func+""+type[0])]
						}
						this.packetTypeString  = "MSC"
					break
					case "d4" :
					// this is an UTE Telegram (Universal Teach In)
						this.raw               = pad(rawDataByte.toString("hex"),dataLength*2 )// extract the data byte (Byte0) as a padded hex string
						this.learnBit          = 0
						this.packetTypeString  = "UTE"
						var type           = this.raw.substring(8,10)
						var func           = this.raw.substring(10,12)
						var choice          = this.raw.substring(12,14)
						var MANUFACTURERID = parseInt(this.raw .substring(4,6),16)
						this.manufacturerid=MANUFACTURERID
						this.eep           = choice+"-" + pad( func , 2 ) + "-" + pad( type , 2 )
						this.manufacturer  = Manufacturer_List[ MANUFACTURERID ]
					break
				}
			break
		}
	}
}
// a helper function repeated here, so this module does not require anything
function pad( num , size ) { // fill a string with leading zeros up to size
    var s = "00000000000000000000000000000000" + num // maximum number of zero we need
    return s.substr( s.length - size ) // cut to size
}
