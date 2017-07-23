module.exports=decode
const EEP =require("./eep.json")
function decode(tel,eepstr){
  var eep = EEP[eepstr]
  if(eep==undefined) return null
  var size=1
  var ret=""
  if(tel.substring(0,2)=="a5") size=4
  var td = new Teldata(size)
  td.setByteStringHex(tel.substr(2,2*size))
  var status=parseInt(tel.substring(12,14))
  if(!Array.isArray(eep.case))eep.case=[eep.case]
  eep.case.forEach(function(item){
    if(item.condition!=undefined && item.condition.statusfield!=undefined){
      var s1=new Teldata(1)
      s1.setSingleBit(item.condition.statusfield[0].bitoffs*1,item.condition.statusfield[0].value*1)
      s1.setSingleBit(item.condition.statusfield[1].bitoffs*1,item.condition.statusfield[1].value*1)
      if(s1.toString()==status){
        ret = decodeTel(td,item)
      }
    }else{
      ret = decodeTel(td,item)
    }
  })
  return ret
}

function decodeTel(data,c){
  var ret = {}
  if(!Array.isArray(c.datafield))c.datafield=[c.datafield]
  c.datafield.forEach(function(item){
    var val =  data.getValue(item.bitoffs*1,item.bitsize*1)
    if(item.enum!=undefined && item.enum.item!=undefined){
      for(var i = 0;i<item.enum.item.length;i++){
        if(item.enum.item[i].hasOwnProperty("min")){
          if(item.enum.item[i].min<=val && item.enum.item[i].max >= val){
            ret[item.shortcut]={name:item.data,value:val,desc:item.enum.item[i].description,unit:item.unit}
          }
        }
        if(item.enum.item[i].hasOwnProperty("bitmask")){
          var mask=item.enum.item[i].bitmask
          if((val & mask)==item.enum.item[i].bitvalue){
            ret[item.shortcut]={name:item.data,value:item.enum.item[i].value,desc:item.enum.item[i].description,unit:item.unit}
          }
        }
        if(item.enum.item[i].value==val){
          ret[item.shortcut]={name:item.data,value:val,desc:item.enum.item[i].description,unit:item.unit}
        }
      }
    }
    if(item.hasOwnProperty("range")){

      var rdist = item.range.max*1-item.range.min*1
      var sdist = item.scale.max*1-item.scale.min*1
      var dx = (sdist/rdist)
      var val = (val-item.range.min*1)*dx+item.scale.min*1
      ret[item.shortcut]={name:item.data,value:val,unit:item.unit}
    }
  })

  return ret
}

function Teldata(bytes){
  this.bits=""
  for(var i = 0;i<bytes*8;i++){
    this.bits+="0"
  }
  this.setSingleBit = function(index,value){
    if(value>1) console.log("!")
    this.bits=this.bits.substr(0,index*1) + value*1 + this.bits.substr(index*1+1);
  }
  this.setBits = function(index,length,value){
    // value is max 1 byte (255) in dec
    var binValue = pad((value*1).toString(2),length*1)
    for(var i = 0;i<length*1;i++){
      this.setSingleBit(index*1+i,binValue[i])
    }
  }
  this.setByteStringHex= function(bytestring){
    //make sure bytestring has an even number of digits if not add a leading zero
    if(bytestring.length%0!=0) bytestring="0"+bytestring
    for(var i = 0;i<bytestring.length-1;i+=2){
      var singlebyte=bytestring.substr((i+1),2)
      this.setBits(i*4,8,parseInt(singlebyte,16))
    }
  }

  this.getValue = (start,length) => parseInt(this.bits.substr(start,length),2)
  this.toSVG=function(){
    var b = this.toString(2)
    var st=`<svg width="${b.length*4}px" height="1em">`
    for(var i = 0;i<b.length;i++){
      st+=`<rect x="${i*4}" y="0" width="4" height="100%" class="${b[i]==1?"bit_set":"bit_unset"}"/>`
    }
    return st+"</svg>"
  }
  this.toString=function(base){
    var out=""
    if(base===undefined) base=16
    for(var i=0;i<this.bits.length;i+=8){
      var currentbyte = parseInt(this.bits.substr(i,8),2)
      switch(base){
        case 16:
          out+=pad(currentbyte.toString(base),2)
          break
        case 2:
          out+=pad(currentbyte.toString(base),8)
          break
        case 10:
          out+=pad(currentbyte.toString(base),3)
          break
      }
    }
    return out
  }
  function pad (num,size) {
      var s = "00000000000000000000000000000000" + num;
      return s.substr(s.length-size);
    }
}
function pad (num,size) {
    var s = "00000000000000000000000000000000" + num;
    return s.substr(s.length-size);
  }
