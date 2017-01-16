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
exponential_rand.prototype.mmpp_rand_generator = function(landa1, landa2, p){
	var temp_state = 1;
	for(i = 0; i< this.data_size; i++){
		var rand_value = Math.random();
		rand_value = Math.floor(rand_value*Random_Precision)/Random_Precision;
		var x = 0;
		if(temp_state == 1){
			x = Math.log(1-rand_value)/(-landa1);
		}
		else{
			x = Math.log(1-rand_value)/(-landa2);
		}
		var c_state = false;
		if(Math.random() >= p){
			c_state = true;
		}
		if(c_state){
			if(temp_state == 1){
				temp_state = 2;
			}
			else{
				temp_state = 1;
			}
		}
		this.data.push(x);
	}
}
exponential_rand.prototype.d_rand_generator = function(landa){
	for(i = 0; i< this.data_size; i++){
		// var rand_value = Math.random();
		// rand_value = Math.floor(rand_value*Random_Precision)/Random_Precision;
		// var x = Math.log(1-rand_value)/(-landa);
		this.data.push(1/landa);
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
function mmx_event(){
	this.test_timer = 0;
	this.total_count = 0;
	this.total_length = 0;
	this.filter_count = 0;
	this.sample_time = 0.5;
}
mmx_event.prototype.mmx_record_length = function(event_time, queuing_length, x){
	this.test_timer = event_time + this.test_timer;
	var temp_sec = this.test_timer / this.sample_time;
	temp_sec = Math.floor(temp_sec);
	this.total_count = this.total_count + temp_sec;
	if(queuing_length <= x){
		this.total_length = this.total_length + temp_sec*0;
	}
	else{
		this.total_length = this.total_length + temp_sec * (queuing_length - x);
	}
	this.test_timer = this.test_timer % this.sample_time;
}
mmx_event.prototype.init = function(){
	this.test_timer = 0;
	this.total_count = 0;
	this.total_length = 0;
	this.filter_count = 0;
}
function input_date(){
	this.arrival = new Object();
	this.service = new Object();
	this.D_service = new Object();
	this.mmpp_arrival = new Object();
}
input_date.prototype.arrival_generator = function(arrival_rate){
	if(arrival_rate in this.arrival){
		return null;
	}
	else{
		this.arrival[arrival_rate] = new exponential_rand();
		this.arrival[arrival_rate].exponential_rand_generator(arrival_rate);
		return true;
	}
}
input_date.prototype.mmpp_arrival_generator = function(arrival_rate1, arrival_rate2, p1){
	var arrival_rate = arrival_rate1 + '_' + arrival_rate2 + '_' + p1;
	if(arrival_rate in this.mmpp_arrival){
		return null;
	}
	else{
		this.mmpp_arrival[arrival_rate] = new exponential_rand();
		this.mmpp_arrival[arrival_rate].mmpp_rand_generator(arrival_rate1, arrival_rate2, p1);
		return true;
	}
}
input_date.prototype.service_generator = function(serval, service_rate){
	if(service_rate in this.service){
		// console.log("y");
		if(this.service[service_rate].length < serval){
			for(var i = 0; i < serval-this.service[service_rate].length; i++){
				var temp_service;
				temp_service = new exponential_rand();
				temp_service.exponential_rand_generator(service_rate);
				this.service[service_rate].push(temp_service);
			}
			return true;
		}
		else{
			return null;
		}
	}
	else{
		this.service[service_rate] = new Array();
		for(var i = 0; i < serval; i++){
			var temp_service;
			temp_service = new exponential_rand();
			temp_service.exponential_rand_generator(service_rate);
			this.service[service_rate].push(temp_service);
		}
		return true;
	}
}
// update 1/10/2017 
input_date.prototype.D_service_generator = function(serval, service_rate){
	if(service_rate in this.D_service){
		// console.log("y");
		if(this.D_service[service_rate].length < serval){
			for(var i = 0; i < serval-this.D_service[service_rate].length; i++){
				var temp_service;
				temp_service = new exponential_rand();
				temp_service.d_rand_generator(service_rate);
				this.D_service[service_rate].push(temp_service);
			}
			return true;
		}
		else{
			return null;
		}
	}
	else{
		this.D_service[service_rate] = new Array();
		for(var i = 0; i < serval; i++){
			var temp_service;
			temp_service = new exponential_rand();
			temp_service.d_rand_generator(service_rate);
			this.D_service[service_rate].push(temp_service);
		}
		return true;
	}
}

input_date.prototype.get_arrival = function(arrival_rate){
	return this.arrival[arrival_rate];
}
input_date.prototype.get_mmpp_arrival = function(arrival_rate1, arrival_rate2, p){
	var arrival = arrival_rate1 + '_' + arrival_rate2 + '_' + p;
	return this.mmpp_arrival[arrival];
}
input_date.prototype.get_service = function(service_rate){
	return this.service[service_rate];
}

// update 1/10/2017
input_date.prototype.get_D_service = function(service_rate){
	return this.D_service[service_rate];
}

function checking_sevice_status(service_array){
	if(service_array.length == 1){
		return 0;
	}
	// return service_array.indexOf(0);
	for(var i = 0; i < service_array.length; i++){
		if(service_array[i] > 0){
			return i;
		}
	}
	return service_array.length-1;
}
function array_max(service_array){
	if(service_array.length == 1){
		return 0;
	}
	var max = service_array[0];
	var temp_index = 0;
	for(var i = 0; i < service_array.length; i++){
		if(max < service_array[i]){
			max = service_array[i];
			temp_index = i;
		}
	}
	// return service_array.indexOf(max);
	return temp_index;
	// return max;
}
function array_min(service_array){
	if(service_array.length == 1){
		return 0;
	}
	var min = service_array[0];
	var temp_index = 0;
	for(var i = 0; i < service_array.length; i++){
		if(min > service_array[i]){
			min = service_array[i];
			temp_index = i;
		}
	}
	// return service_array.indexOf(min);
	return temp_index;
	// return min;
}
function n_recursive(n){
	var count = 1;
	while(n > 0){
		count = count*n;
		n--;
	}
	return count;
}
function MMxk_blocking_rate_theoretical_value(arrival_rate, service_rate, m, k){
	return MMxk_Pn_theoretical_value(arrival_rate, service_rate, m, k, k);
}
function MMxk_P0_theoretical_value(arrival_rate, service_rate, x,k){
	var low = arrival_rate / service_rate;
	var p0_sigma_element = 0;
	var n = 0;

	while(n <= (x-1)){
		p0_sigma_element = p0_sigma_element + Math.pow(low, n) / n_recursive(n);
		n++;
	}
	var p0_reverse;
	if(arrival_rate / (x * service_rate) != 1){
		p0_reverse = p0_sigma_element + (Math.pow(low, x) / n_recursive(x)) * ((1 - Math.pow(arrival_rate / (x * service_rate), k - x + 1)) / (1 - arrival_rate / (x * service_rate)))
	}
	else{
		p0_reverse = p0_sigma_element+(Math.pow(low, x) / n_recursive(x)) * (k - x + 1);
	}
	var p0 = 1/p0_reverse;
	return p0;
}
function MMxk_Pn_theoretical_value(arrival_rate, service_rate, x, k, n){
	var low = arrival_rate / service_rate;
	var pn;
	if(0<=n && n<x){
		pn = 1/n_recursive(n)*Math.pow(low, n)*MMxk_P0_theoretical_value(arrival_rate, service_rate, x, k);
		return pn;
	}
	else if(x <= n && n <= k){
		pn = 1/(Math.pow(x, n-x)*n_recursive(x))*Math.pow(low, n)*MMxk_P0_theoretical_value(arrival_rate, service_rate, x, k);
		return pn;
	}
	return 0;
}
function MMxk_Nq_theoretical_value(arrival_rate, service_rate, x, k){
	var nq = 0;
	var i = x;
	while(i <= k){
		nq = nq + (i-x)*MMxk_Pn_theoretical_value(arrival_rate, service_rate, x, k, i);
		i++;
	}
	return nq;
}
function MMx_Nq_theoretical_value(arrival_rate, service_rate, x){
	var low = arrival_rate / service_rate;

	var p0_sigma_element = 0;
	var n = 0;

	while(n <= (x-1)){
		p0_sigma_element = p0_sigma_element + Math.pow(low, n) / n_recursive(n);
		n++;
	}
	var p0_reverse = p0_sigma_element + (Math.pow(low, x)/n_recursive(x))*(x*service_rate/(x*service_rate-arrival_rate));
	var p0 = 1 / p0_reverse;
	var nq = Math.pow(low, x)*arrival_rate*service_rate*p0/(n_recursive(x-1)*Math.pow(x*service_rate-arrival_rate, 2));
	return nq;
}

var mmx_event = new mmx_event();
function MMmk_model( m, arrival_rate, service_rate, k, arrival_rand, service_rand, type){
	var blocking_count = 0;

	var arrival = arrival_rand;
	var service_array = service_rand;

	arrival.init_picker();
	for(var i = 0; i < service_array.length; i++){
		service_array[i].init_picker();
	}
	mmx_event.init();

	var get_arrival_count = 0;

	var queuing_length = 0;

	var temp_arrival_time = 0;
	var temp_service_time = new Array(m).fill(0);
	var total_time = 0;

	while(get_arrival_count < arrival.data_size){		
		temp_arrival_time = arrival.take_queue();
		if(temp_arrival_time == null){
			return;
		}
		get_arrival_count ++;
		while(1){
			if(queuing_length >= m){
				var temp = array_min(temp_service_time);
				if(temp_arrival_time >= temp_service_time[temp]){
					mmx_event.mmx_record_length(temp_service_time[temp], queuing_length, m);
					queuing_length--;
					
					if(m!=1){
						temp_service_time[(temp+1)%m] -= temp_service_time[temp];
					}
					temp_arrival_time -= temp_service_time[temp];
					temp_service_time[temp] = 0;
					if(queuing_length >= m){
						temp_service_time[temp] = service_array[temp].take_queue();
						if(temp_service_time[temp] == null){
							return;
						}
						total_time += (queuing_length - 1) * temp_service_time[temp];
					}
				}
				else{
					mmx_event.mmx_record_length(temp_arrival_time,queuing_length,m);
					for(var i =0; i < service_array.length; i++){
						temp_service_time[i] = temp_service_time[i] - temp_arrival_time;
					}
					if(k > 0 && queuing_length >= k){
						blocking_count++;
					}
					else{
						queuing_length++;
						total_time += temp_service_time[temp];
					}
					break;
				}
			}
			else{
				if(queuing_length == 0){
					mmx_event.mmx_record_length(temp_arrival_time, queuing_length,m);
					temp_service_time[0] = service_array[0].take_queue();
					if(temp_service_time[0] == null){
						return;
					}
					queuing_length++;
				}
				else{
					var temp = checking_sevice_status(temp_service_time);
					if(temp_arrival_time > temp_service_time[temp]){
						mmx_event.mmx_record_length(temp_service_time[temp], queuing_length, m);
						queuing_length--;
						temp_arrival_time -= temp_service_time[temp];
						temp_service_time[temp] = 0;
						mmx_event.mmx_record_length(temp_arrival_time, queuing_length, m);
						temp_service_time[temp] = service_array[temp].take_queue();
						if(temp_service_time[temp] == null){
							return;
						}
						queuing_length++;
					}
					else{
						mmx_event.mmx_record_length(temp_arrival_time,queuing_length,m);
						temp_service_time[temp] -= temp_arrival_time;
						temp_service_time[(temp+1)%m] = service_array[(temp+1)%m].take_queue();
						if(temp_service_time[(temp+1)%m] == null){
							return;
						}
						queuing_length++;
					}
				}
				break;
			}
		}
	}
	var result = mmx_event.total_length / mmx_event.total_count;
	var blocking_rate = blocking_count / arrival.data_size;
	var waiting_time = total_time / (arrival.data_size - blocking_count);
	
	if(type == "D"){
		var nq_th = MMxk_Nq_theoretical_value(arrival_rate, service_rate, m, k);
		var blocking_rate_th = MMxk_blocking_rate_theoretical_value(arrival_rate, service_rate,m,k);
		console.log("M/D/%d/%d Arrival Rate : %s Service Rate : %s k : %s", m, k, arrival_rate, service_rate, k);
		console.log('M/D/%d/%d Nq : Statistical : %s / Theoretical : %s ', m, k, result, nq_th);
		console.log("M/D/%d/%d Blocking rate : %s / Theoretical : %s", m, k, blocking_rate, blocking_rate_th);
		console.log("M/D/%d/%d waiting time : %s", m, k, waiting_time);
		console.log();
		var temp_return = {};
		temp_return.arrival_rate = m;
		temp_return.service_rate = service_rate;
		temp_return.nq_st = result;
		temp_return.nq_th = nq_th;
		temp_return.br_st = blocking_rate;
		temp_return.br_th = blocking_rate_th;
		temp_return.wt_t = waiting_time;
		return temp_return;
	}
	if(type=="MMPP"){
		var nq_th = MMxk_Nq_theoretical_value(arrival_rate, service_rate, m, k);
		var blocking_rate_th = MMxk_blocking_rate_theoretical_value(arrival_rate, service_rate,m,k);
		console.log("MMPP/M/%d/%d Arrival Rate : %s Service Rate : %s k : %s", m, k, arrival_rate, service_rate, k);
		console.log('MMPP/M/%d/%d Nq : Statistical : %s / Theoretical : %s ', m, k, result, nq_th);
		console.log("MMPP/M/%d/%d Blocking rate : %s / Theoretical : %s", m, k, blocking_rate, blocking_rate_th);
		console.log("MMPP/M/%d/%d waiting time : %s", m, k, waiting_time);
		console.log();
		var temp_return = {};
		temp_return.arrival_rate = m;
		temp_return.service_rate = service_rate;
		temp_return.nq_st = result;
		temp_return.nq_th = nq_th;
		temp_return.br_st = blocking_rate;
		temp_return.br_th = blocking_rate_th;
		temp_return.wt_t = waiting_time;
		return temp_return;
	}
	if(k>0){
		var nq_th = MMxk_Nq_theoretical_value(arrival_rate, service_rate, m, k);
		var blocking_rate_th = MMxk_blocking_rate_theoretical_value(arrival_rate, service_rate,m,k);
		console.log("M/M/%d/%d Arrival Rate : %s Service Rate : %s k : %s", m, k, arrival_rate, service_rate, k);
		console.log('M/M/%d/%d Nq : Statistical : %s / Theoretical : %s ', m, k, result, nq_th);
		console.log("M/M/%d/%d Blocking rate : %s / Theoretical : %s", m, k, blocking_rate, blocking_rate_th);
		console.log("M/M/%d/%d waiting time : %s", m, k, waiting_time);
		console.log();
		var temp_return = {};
		temp_return.arrival_rate = m;
		temp_return.service_rate = service_rate;
		temp_return.nq_st = result;
		temp_return.nq_th = nq_th;
		temp_return.br_st = blocking_rate;
		temp_return.br_th = blocking_rate_th;
		temp_return.wt_t = waiting_time;
		return temp_return;
	}
	else{
		var nq_th = MMx_Nq_theoretical_value(arrival_rate, service_rate, m);
		console.log("M/M/%d Arrival Rate : %s Service Rate : %s", m, arrival_rate, service_rate);
		// console.log("%d %d", mmx_event.total_length, mmx_event.total_count);
		console.log('M/M/%d Nq : Statistical %s / Theoretical %s ', m, result, nq_th);
		console.log("M/M/%d waiting time : %s", m, waiting_time);
		console.log();
		var temp_return = {};
		temp_return.arrival_rate = m;
		temp_return.service_rate = service_rate;
		temp_return.nq_st = result;
		temp_return.nq_th = nq_th;
		temp_return.wt_t = waiting_time;
		return temp_return;
	}
}


var input_date = new input_date();
function main(){
// 	console.log("****************");
// 	console.log("M/M/1 (landa = 1~5, mean = 5)");
// 	console.log("****************");
// 	input_date.service_generator(2,5);
// 	for(var arrival = 1; arrival< 5; arrival++){
// 		input_date.arrival_generator(arrival);
// 		MMmk_model(1, arrival, 5, 0, input_date.get_arrival(arrival), input_date.get_service(5));
// 	}

	console.log("****************");
	console.log("M/M/1/k vs M/D/1/k vs MMPP/M/1/k (k = 2, 3, 4, 5, 6, mean = 4)");
	console.log("****************");
	for(var k = 2; k <=6 ; k++){
		input_date.arrival_generator(3);
		input_date.service_generator(1,4);
		// input_date.service_generator(1,5);

		//update 1/10/2017 M/D/1/k
		input_date.D_service_generator(1,4);
		//update 1/16/2017 MMPP/M/1/k
		input_date.mmpp_arrival_generator(5, 1, 0.3);// arrival rate 1 , arrival rate 2 , p
		input_date.mmpp_arrival_generator(5, 1, 0.5);
		input_date.mmpp_arrival_generator(5, 1, 0.7);
		// input_date.get_mmpp_arrival(5, 1);// arrival rate 1 , arrival rate 2 , p
		console.log("M/M/1/k");
		MMmk_model(1, 3, 4, k, input_date.get_arrival(3), input_date.get_service(4));
		// MMmk_model(1, 3, 5, k, input_date.get_arrival(3), input_date.get_service(5));

		//update 1/10/2017 M/D/1/k
		console.log("M/D/1/k");
		MMmk_model(1, 3, 4, k, input_date.get_arrival(3), input_date.get_D_service(4),'D');

		//update 1/16/2017 MMPP/M/1/k
		console.log("MMPP/M/1/k p = 0.3");
		MMmk_model(1, 3, 4, k, input_date.get_mmpp_arrival(5, 1, 0.3), input_date.get_service(4),'MMPP');
		console.log("MMPP/M/1/k p = 0.5");
		MMmk_model(1, 3, 4, k, input_date.get_mmpp_arrival(5, 1, 0.5), input_date.get_service(4),'MMPP');
		console.log("MMPP/M/1/k p = 0.7");
		MMmk_model(1, 3, 4, k, input_date.get_mmpp_arrival(5, 1, 0.7), input_date.get_service(4),'MMPP');
		// 
	}

	console.log("****************");
	console.log("M/M/1/5 vs M/D/1/5 vs MMPP/M/1/5 (mean = 4, 5, 6, 7 landa = 3 & 5,1)");
	console.log("****************");
	for(var s = 4; s <= 7; s++){
		input_date.service_generator(1,s);
		input_date.D_service_generator(1,s);
		console.log("M/M/1/k");
		MMmk_model(1, 3, s, 5, input_date.get_arrival(3), input_date.get_service(s));
		// MMmk_model(1, 3, 5, k, input_date.get_arrival(3), input_date.get_service(5));

		//update 1/10/2017 M/D/1/k
		console.log("M/D/1/k");
		MMmk_model(1, 3, s, 5, input_date.get_arrival(3), input_date.get_D_service(s),'D');

		//update 1/16/2017 MMPP/M/1/k
		console.log("MMPP/M/1/k p = 0.3");
		MMmk_model(1, 3, s, 5, input_date.get_mmpp_arrival(5, 1, 0.3), input_date.get_service(s),'MMPP');
		console.log("MMPP/M/1/k p = 0.5");
		MMmk_model(1, 3, s, 5, input_date.get_mmpp_arrival(5, 1, 0.5), input_date.get_service(s),'MMPP');
		console.log("MMPP/M/1/k p = 0.7");
		MMmk_model(1, 3, s, 5, input_date.get_mmpp_arrival(5, 1, 0.7), input_date.get_service(s),'MMPP');
	}
	
// 	console.log("****************");
// 	console.log("M/M/1 & M/M/2 (landa = 1~7, mean1 = 5, mean2 = 2.5)");
// 	console.log("****************");
// 	input_date.service_generator(2,2.5);
// 	for(var arrival = 1; arrival< 7; arrival++){
// 		input_date.arrival_generator(arrival);
// 		MMmk_model(1, arrival, 5, 0, input_date.get_arrival(arrival), input_date.get_service(5));
// 		MMmk_model(2, arrival, 2.5, 0, input_date.get_arrival(arrival), input_date.get_service(2.5));
// 	}

// 	console.log("****************");
// 	console.log("M/M/1/k & M/M/2/k (k = 4, 6, 8, 10, 12, landa = 1~7, mean1 = 5, mean2 = 2.5)");
// 	console.log("****************");
// 	for(var k  = 4; k <= 12; k+=2){
// 		for(var arrival = 1; arrival< 7; arrival++){
// 			input_date.arrival_generator(arrival);
// 			MMmk_model(1, arrival, 5, k, input_date.get_arrival(arrival), input_date.get_service(5));
// 			MMmk_model(2, arrival, 2.5, k, input_date.get_arrival(arrival), input_date.get_service(2.5));
// 		}
// 	}

// 	console.log("****************");
// 	console.log("M/M/m/m (m = 2~5, landa = 5, mean = 2)");
// 	console.log("****************");
// 	input_date.service_generator(5,2);
// 	input_date.arrival_generator(5);
// 	for(var m = 2; m <=5; m++){
// 		MMmk_model(m, 5, 2, m, input_date.get_arrival(5), input_date.get_service(2));
// 	}
}
main();
