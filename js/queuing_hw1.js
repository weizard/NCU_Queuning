var Random_Precision = 10000;
var Exponential_Block_Number = 50;
var Poisson_Block_Number = 20;
var Exponential_Test_Time = 100000;
var Poisson_Test_Time = 100000;

queuing_hw1_testing();

function queuing_hw1_testing(){
	// exponential_inter_arrival_generator_test(1);
}

function exponential_theoretical_value(landa, p1, p2){
	var theoretical_value;
	theoretical_value = Math.exp(-p1*landa) - Math.exp(-p2*landa);
	return theoretical_value;
}
function exponential_rand_generator(landa){
	var rand_value = Math.random();
	rand_value = Math.floor(rand_value*Random_Precision)/Random_Precision;
	var x = Math.log(1-rand_value)/(-landa);
	// console.log(x);
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
	var mean_output = "";
    // mean = 1/landa  ,  landa = 1/mean 
	landa = 1/mean;
	block_limit_value = Exponential_Block_Number*0.5;

	while(count < Exponential_Test_Time){
		count++;
		temp_value = exponential_rand_generator(landa);
		mean_output = mean_output + Number(temp_value.toFixed(4)).toString() + "\n";
		if(temp_value < block_limit_value){
			temp_block = temp_value*10/5;
			block[Math.floor(temp_block)]++;
		}
	}

	// var blob = new Blob([mean_output], {type: "text/plain;charset=utf-8"});
	// saveAs(blob, "RowData_"+mean.toString()+".txt");
	// console.log("---------------------- [ Block(0.5/unit) - Statistical / Theoretical ] ----------------------");

	var temp_double_value_st;
	var temp_double_value_th;
	var temp_double_CDF_value_st = 0;
	var temp_double_CDF_value_th = 0;
	var exponential_inter_arrival_array = new Array();
	var exponential_inter_arrival_obj_st = new Object();
	var exponential_inter_arrival_obj_th = new Object();
	var CDF_array_th = new Array();
	var CDF_array_st = new Array();
	

	for(var i = 0; i < Exponential_Block_Number; i++){
		var temp_CDF_obj_th = new Object();
		var temp_CDF_obj_st = new Object();
		temp_double_value_st = block[i]/Exponential_Test_Time;
		temp_double_CDF_value_st = temp_double_value_st + temp_double_CDF_value_st;
		temp_double_value_th = exponential_theoretical_value(landa, i*0.5, (i+1)*0.5);
		temp_double_CDF_value_th = temp_double_value_th + temp_double_CDF_value_th;
		// console.log("["+count+"-"+temp_double_value_st+"/"+temp_double_value_th+"]");
		// console.log("["+i+"- PDF "+temp_double_value_st+"/"+temp_double_value_th+" CDF "+temp_double_CDF_value_st+"/"+temp_double_CDF_value_th+"]");
		temp_CDF_obj_th.time = (i+1)*0.5;
		// temp_CDF_obj_th.value = Math.floor(temp_double_CDF_value_th*10000);
		temp_CDF_obj_th.value = temp_double_CDF_value_th;
		temp_CDF_obj_st.time = (i+1)*0.5;
		// temp_CDF_obj_st.value = Math.floor(temp_double_CDF_value_st*10000);
		temp_CDF_obj_st.value = temp_double_CDF_value_st;
		CDF_array_st.push(temp_CDF_obj_st);
		CDF_array_th.push(temp_CDF_obj_th);
	}
	exponential_inter_arrival_obj_th.id = mean.toString()+"th";
	exponential_inter_arrival_obj_th.values = CDF_array_th;
	exponential_inter_arrival_obj_st.id = mean.toString()+"st";
	exponential_inter_arrival_obj_st.values = CDF_array_st;
	exponential_inter_arrival_array.push(exponential_inter_arrival_obj_st);
	exponential_inter_arrival_array.push(exponential_inter_arrival_obj_th);
	// console.log(JSON.stringify(exponential_inter_arrival_array));
	exponential_inter_arrival_array.push(mean_output);
	return(exponential_inter_arrival_array);
	
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

	// console.log("---------------------- [ Block(0.5/unit) - Statistical / Theoretical ] ----------------------");

	var temp_result_st;
	var temp_result_th;
	var temp_result_CDF_st = 0;
	var temp_result_CDF_th = 0;
	var exponential_unit_arrival_array = new Array();
	var exponential_unit_arrival_obj_st = new Object();
	var exponential_unit_arrival_obj_th = new Object();
	var PDF_array_st = new Array()
	var PDF_array_th = new Array()

	for(var i =0; i < Poisson_Block_Number; i++){
		var temp_PDF_obj_th = new Object();
		var temp_PDF_obj_st = new Object();

		temp_result_st = block[i]/Poisson_Test_Time;
		temp_result_CDF_st = temp_result_st + temp_result_CDF_st;
		temp_result_th = poisson_theoretical_value(1, exponential_landa, i);
		temp_result_CDF_th = temp_result_th + temp_result_CDF_th;
		// console.log("["+i+"-"+temp_result_st+"/"+temp_result_th+"]");
		temp_PDF_obj_th.time = i;
		temp_PDF_obj_st.time = i;
		temp_PDF_obj_th.value =temp_result_th;
		temp_PDF_obj_st.value =temp_result_st;
		PDF_array_th.push(temp_PDF_obj_th);
		PDF_array_st.push(temp_PDF_obj_st);
		// console.log("["+i+"- PDF "+temp_result_st+"/"+temp_result_th+", CDF "+temp_result_CDF_st+"/"+temp_result_CDF_th+"]");
	}
	exponential_unit_arrival_obj_st.id = exponential_mean.toString()+"st";
	exponential_unit_arrival_obj_th.id = exponential_mean.toString()+"th";
	exponential_unit_arrival_obj_st.values = PDF_array_st;
	exponential_unit_arrival_obj_th.values = PDF_array_th;
	exponential_unit_arrival_array.push(exponential_unit_arrival_obj_st);
	exponential_unit_arrival_array.push(exponential_unit_arrival_obj_th);
	return(exponential_unit_arrival_array);
}