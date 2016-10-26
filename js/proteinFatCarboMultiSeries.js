var margin = {
        top: 20,
        right: 80,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

d3.json("./../json/regions.json", function(error, Data) {
    if (error) throw error;

    // xData gives an array of distinct 'items' for which trends chart is going to be made.
    var xData = Data[0].consumption.map(function(d) {
        return (d.item);
    });
    //console.log(xData);

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function(d) {
            return x((d.item)) + x.rangeBand() / 2;
        })
        .y(function(d) {
            return y(d.value);
        });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    color.domain(Data.map(function(d) {
        return d.region;
    }));

    x.domain(xData);

    var valueMax = d3.max(Data, function(r) {
        return d3.max(r.consumption, function(d) {
            return d.value;
        })
    });
    var valueMin = d3.min(Data, function(r) {
        return d3.min(r.consumption, function(d) {
            return d.value;
        })
    });
    y.domain([valueMin, valueMax]);

    //Drawing X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Drawing Horizontal grid lines.
    svg.append("g")
        .attr("class", "GridX")
        .selectAll("line.grid").data(y.ticks()).enter()
        .append("line")
        .attr({
            "class": "grid",
            "x1": x(xData[0]),
            "x2": x(xData[xData.length - 1]) + 150,
            "y1": function(d) {
                console.log("Y(d):" + y(d));
                return y(d);
            },
            "y2": function(d) {
                return y(d);
            }
        });
    // Drawing Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Consumption");

    // Drawing Lines for each segments
    var segment = svg.selectAll(".segment")
        .data(Data)
        .enter().append("g")
        .attr("class", "segment");

    segment.append("path")
        .attr("class", "line")
        .attr("id", function(d) {
            return d.region;
        })
        .attr("visible", 1)
        .attr("d", function(d) {
            return line(d.consumption);
        })
        .style("stroke", function(d) {
            return color(d.region);
        });
    // Creating Dots on line
    segment.selectAll("dot")
        .data(function(d) {
            return d.consumption;
        })
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) {
            return x(d.item) + x.rangeBand() / 2;
        })
        .attr("cy", function(d) {
            return y(d.value);
        })
        .style("stroke", "white")
        .style("fill", function(d) {
            return color(this.parentNode.__data__.region);
        })
        .on("mouseover", mouseover)
        .on("mousemove", function(d) {
            console.log("parentNode" + this.parentNode._data_);
            divToolTip
                .text(this.parentNode.__data__.region + " : " + d.value)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 10) + "px");
        })
        .on("mouseout", mouseout);

    segment.append("text")
        .datum(function(d) {
            return {
                region: d.region,
                RevData: d.consumption[d.consumption.length - 1]
            };
        })
        .attr("transform", function(d) {
            var xpos = x(d.RevData.item) + 150;
            console.log(xpos);
            return "translate(" + xpos + "," + y(d.RevData.value) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .attr("class", "segmentText")
        .attr("Segid", function(d) {
            return d.region;
        })
        .text(function(d) {
            return d.region;
        });

    d3.selectAll(".segmentText").on("click", function(d) {
        var tempId = d3.select(this).attr("Segid");
        var flgVisible = d3.select("#" + tempId).attr("visible");

        var newOpacity = flgVisible == 1 ? 0 : 1;
        flgVisible = flgVisible == 1 ? 0 : 1;

        // Hide or show the elements
        d3.select("#" + tempId).style("opacity", newOpacity)
            .attr("visible", flgVisible);

    });
    // Adding Tooltip
    var divToolTip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 1e-6);

    function mouseover() {
        divToolTip.transition()
            .duration(500)
            .style("opacity", 1);
    }

    function mouseout() {
        divToolTip.transition()
            .duration(500)
            .style("opacity", 1e-6);
    }
});