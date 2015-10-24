module.exports = {
	pad: function(num,size) {
		var s = "00000000000000000000000000000000" + num;
		return s.substr(s.length-size);
	},
	generateValue: function(minB,maxB,minV,maxV,val1){
		var B=((maxV-minV)/(maxB-minB))
		val0   = ((val1-minV)/B)+minB
		return this.pad(Math.floor(val0).toString(16),2)
	},
	generate10BitValue: function(minB,maxB,minV,maxV,val1){
		var B=((maxV-minV)/(maxB-minB))
		val0   = ((val1-minV)/B)+minB
		return this.pad(Math.floor(val0).toString(16),4)
	}
}