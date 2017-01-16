var Random_Precision = 10000;

var exponential_rand = function (){
	this.data_size = 200000;
	this.index = 0;
	this.data = [];
}
exponential_rand.prototype.exponential_rand_generator = function(landa){
	for(i = 0; i< this.data_size; i++){
		var rand_value = Math.random();
		rand_value = Math.floor(rand_value*Random_Precision)/Random_Precision;
		var x = Math.log(1-rand_value)/(-landa);
		this.data.push(x);
	}
}
exponential_rand.prototype.d_rand_generator = function(landa){
	for(i = 0; i< this.data_size; i++){
		// var rand_value = Math.random();
		// rand_value = Math.floor(rand_value*Random_Precision)/Random_Precision;
		// var x = Math.log(1-rand_value)/(-landa);
		this.data.push(landa);
	}
}
exponential_rand.prototype.init_picker = function(){
	this.index = 0;
}
exponential_rand.prototype.take_queue = function(){
	var temp = this.data[this.index];
	this.index++;
	if(this.index<=this.data_size){
		return temp;
	}
	else{
		return null;
	}
}
exponential_rand.prototype.put_array = function(a){
	this.data = a;
}

module.exports = exponential_rand;