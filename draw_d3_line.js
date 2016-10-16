function draw_d3(st, th, type, svg_id) {

    var x_range;
    var y_range;
    var x_lable;
    var y_lable;
    var title_lable;

    if (type == "CDF") {
        x_range = [0, 25];
        y_range = [0, 1];
        x_lable = "t";
        y_lable = "F(t)";
        title_lable = "Exponential distribution CDF";
    }
    if (type == "PDF") {
        x_range = [0, 20];
        // console.log(st);
        var max = 0;
        for(i in st){
          for (j in st[i].values){
            // console.log(Number((st[i].values[j].value).toFixed(4)));
            if(st[i].values[j].value>max)max = st[i].values[j].value;
          }
        }
        y_range = [0, max];
        x_lable = "n";
        y_lable = "P(n)";
        title_lable = "Poisson distribution";
    }

    var svg = d3.select("#" + svg_id),
        margin = { top: 20, right: 80, bottom: 30, left: 50 },
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var z = d3.scaleOrdinal(d3.schemeCategory10);

    var line = d3.line()
        // .curve(d3.curveBasis)
        .x(function(d) {
            return x(d.time); })
        .y(function(d) {
            return y(d.value); });

    x.domain(x_range).nice();
    y.domain(y_range).nice();
    z.domain(st.map(function(c) {
        return c.id; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("transform", "translate(" + (width) + " , 0)")
        .attr("dy", "-0.71em")
        .attr("fill", "#000")
        .style("font", "16px sans-serif")
        .text(x_lable);

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .style("font", "16px sans-serif")
        .text(y_lable);

    g.append("g")
        .append("text")
        .attr("transform", "translate(" + (width / 2) + " , 0)")
        .attr("dy", "-0.31em")
        .attr("fill", "#000")
        .style("font", "16px sans-serif")
        .text(title_lable);

    var q = g.selectAll(".q")
        .data(st)
        .enter().append("g")
        .attr("class", "q");
    q.append("path")
        .attr("class", "line")
        .attr("d", function(d) {
            return line(d.values); })
        .style("stroke", function(d) {
            return z(d.id); });

    q.append("text")
        .datum(function(d) {
            return { id: d.id, value: d.values[d.values.length - 1] }; })
        .attr("transform", function(d) {
            return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; })
        .attr("x", 4)
        .attr("dy", "0.35em")
        .attr("class", type + "_line_lable")
        .style("font", "12px sans-serif")
        .style("fill", function(d) {
            return z(d.id); })
        .text(function(d) {
            return d.id; });

    for (temp in th) {
        var city_dot = g.selectAll(".dot")
            .data(th[temp].values)
            .enter().append("circle")
            .attr("class", "dot1")
            .attr("r", 2)
            .attr("cx", function(d) {
                return x(d.time); })
            .attr("cy", function(d) {
                return y(d.value); });
    }

    var i = 0;
    $(".CDF_line_lable").each(function() {
        $(this).attr("dy", i.toString() + "em");
        i++;
    });
    i = 0;
    $(".PDF_line_lable").each(function() {
        $(this).attr("dy", i.toString() + "em");
        i--;
    });

}
