var Poisson_Block_Number = 20;
var Poisson_Test_Time = 10000000;
var Exponential_Block_Number = 100000;
var Exponential_Test_Time = 100000;

function exponential_theoretical_value(landa, p1, p2){
	var theoretical_value;
	theoretical_value = Math.exp(-p1*landa) - Math.exp(-p2*landa);
	return theoretical_value;
}
function exponential_rand_generator(landa){
	var rand_value = Math.random();
	var x = Math.log(1-rand_value)/-landa;
	return x;
}
function exponential_inter_arrival_generator_test(mean){
	// var Exponential_Block_Number = 100000;
	// var Exponential_Test_Time = 100000;
	var landa;

	var block = new Array();
	for(var i = 0; i < Exponential_Block_Number; i++){
		block[i] = 0;
	}
	
	var temp_value;
	var temp_block;
	var block_limit_value;
	var count = 0;

    // mean = 1/landa  ,  landa = 1/mean 
	landa = 1/mean;
	block_limit_value = Exponential_Block_Number*0.5;//取block_number區間最大值

	while(count < Exponential_Test_Time){
		count++;
		temp_value = exponential_rand_generator(landa);
		if(temp_value < block_limit_value){
			temp_block = temp_value*10/5;
			block[temp_block]++;
		}
	}

	console.log("---------------------- [ Block(0.5/unit) - Statistical / Theoretical ] ----------------------");

	var temp_double_value_st;
	var temp_double_value_th;

	for(count = 0; count < Exponential_Block_Number; count++){
		temp_double_value_st = block[count]/Exponential_Test_Time;
		temp_double_value_th = exponential_theoretical_value(landa, count*0.5, (count+1)*0.5);
		console.log("["+count+"-"+temp_double_value_st+"/"+temp_double_value_th+"]");
	}
}
function poisson_theoretical_value(duration, landa, expect_time){
	var factorial_expect_time;
	var landa_x_duration_pow_n;
	var answer;

	if(expect_time > 0){
		factorial_expect_time = expect_time;
		for(var count = expect_time - 1; count > 0; count--){
			factorial_expect_time = factorial_expect_time * count;
		}
	}
	else{
		factorial_expect_time = 1;
	}

	if(expect_time > 0){
		landa_x_duration_pow_n = duration * landa;
		for(var count = expect_time - 1; count > 0; count--){
			landa_x_duration_pow_n = landa_x_duration_pow_n * duration * landa;
		}
	}
	else{
		landa_x_duration_pow_n = 1;
	}

	answer = (landa_x_duration_pow_n * Math.exp(-duration * landa)) / factorial_expect_time;

	return answer;
}
function exponential_unit_arrival_test(exponential_mean){
	// var Poisson_Block_Number = 20;
	// var Poisson_Test_Time = 10000000;
	var exponential_landa;
	var temp_value;
	var total_time = 0;
	var while_count = 0;
	var temp_count = 0;
	var block = new Array();
	exponential_landa = 1/ exponential_mean;
	for(var i = 0; i < Poisson_Block_Number; i++){
		block[i] = 0;
	}

	while(while_count < Poisson_Test_Time){
		temp_value = exponential_rand_generator(exponential_landa);
		total_time = total_time + temp_value;
		if(total_time < 1){
			temp_count++;
		}
		else{
			if(temp_count < Poisson_Block_Number){
				block[temp_count]++;
			}
			while_count++;
			temp_count = 0;
			total_time = 0;
		}
	}

	console.log("---------------------- [ Block(0.5/unit) - Statistical / Theoretical ] ----------------------");

	var temp_result_st;
	var temp_result_th;

	for(var i =0; i < Poisson_Block_Number; i++){
		temp_result_st = block[i]/Poisson_Test_Time;
		temp_result_th = poisson_theoretical_value(1, exponential_landa, i);
		console.log("["+count+"-"+temp_result_st+"/"+temp_result_th+"]");
	}
}