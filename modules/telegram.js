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

var Manufacturer_List = [ // the List of Manufacturers. the index is equal to the number transmitted in learn telegrams
	'MANUFACTURER_RESERVED' ,'PEHA','THERMOKON','SERVODAN','ECHOFLEX_SOLUTIONS','OMNIO_AG','HARDMEIER_ELECTRONICS','REGULVAR_INC','AD_HOC_ELECTRONICS',
	'DISTECH_CONTROLS','KIEBACK_AND_PETER','ENOCEAN_GMBH','PROBARE','ELTAKO','LEVITON','HONEYWELL','SPARTAN_PERIPHERAL_DEVICES','SIEMENS','T_MAC',
	'RELIABLE_CONTROLS_CORPORATION','ELSNER_ELEKTRONIK_GMBH','DIEHL_CONTROLS','BSC_COMPUTER','S_AND_S_REGELTECHNIK_GMBH','MASCO_CORPORATION','INTESIS_SOFTWARE_SL',
	'VIESSMANN','LUTUO_TECHNOLOGY','SCHNEIDER_ELECTRIC','SAUTER','BOOT_UP','OSRAM_SYLVANIA','UNOTECH','ELTA_CONTROLS_INC','UNITRONIC_AG','NANOSENSE',
	'THE_S4_GROUP','MSR_SOLUTIONS','GE','MAICO','RUSKIN_COMPANY','MAGNUM_ENERGY_SOLUTIONS','KMC_CONTROLS','ECOLOGIX_CONTROLS','TRIO_2_SYS','AFRISO_EURO_INDEX',
	'NEC_ACCESSTECHNICA_LTD','ITEC_CORPORATION','SIMICX_CO_LTD','EUROTRONIC_TECHNOLOGY_GMBH','ART_JAPAN_CO_LTD','TIANSU_AUTOMATION_CONTROL_SYSTE_CO_LTD',
	'GRUPPO_GIORDANO_IDEA_SPA','ALPHAEOS_AG','TAG_TECHNOLOGIES','CLOUD_BUILDINGS_LTD','GIGA_CONCEPT','SENSORTEC','JAEGER_DIREKT','AIR_SYSTEM_COMPONENTS_INC'
	]

module.exports = function enocean_Telegram( ) {
	this.loadFromBuffer    = function( buf ) {
		this.rawByte       = buf.toString( "hex" ) // store the original Buffer as a string in .rawByte
		var dataLength     = 255 * buf[ 1 ] + buf[ 2 ] // length of the Data Part of the telegram
		var optionalLength = buf[ 3 ] // length of the optional data part of the telegram
		this.packetType    = buf[ 4 ] // packet type ( 1=radio telegram , 2=response... )
		var headerCRC      = buf[ 5 ] // checksum of the header 
		// TODO: should we perform a check against the checksum?
		var rawDataByte    = buf.slice( 6 , dataLength + 6 ) // Data byte start at Byte 7 and end at 6 + dataLength 
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