var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
  },
  width = 1000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
  .rangeRoundBands([10, width-10], .2);

var y = d3.scale.linear()
  .rangeRound([height, 0]);
var z = d3.scale.ordinal()
  .range(["#3366cc", "#ff9900"]);
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(d3.format(".2s"));

var position = 0;

var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.json("../json/countries.json", function(error, data) {

  z.domain(d3.keys(data[0]).filter(function(key) {
    return key !== "country";
  }));

  data.forEach(function(d) {
    var y0 = 0;
    d.item = z.domain().map(function(name) {
      return {
        name: name,
        y0: y0,
        y1: y0 += +d[name]
      };
    });
    d.total = d.item[d.item.length - 1].y1;
  });

  data.sort(function(a, b) {
    return b.total - a.total;
  });
  x.domain(data.map(function(d) {
    return d.country;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.total;
  })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 1)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("consumption");

  var country = svg.selectAll(".country")
    .data(data)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) {
      return "translate(" + x(d.country) + ",0)";
    });
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("width", 130)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 60)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold");

  country.selectAll("rect")
    .data(function(d) {
      return d.item;
    })
    .enter().append("rect")
    .attr("width", x.rangeBand())
    .attr("x", function(d) { return x(d.country); })
    .attr("y", function(d) {
      return y(d.y1);
    })
    .attr("height", function(d) {
      return y(d.y0) - y(d.y1);
    })
    .style("fill", function(d) {
      return z(d.name);
    })
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0];
      var yPosition = d3.mouse(this)[1];
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y1);
    });

  var legend = svg.selectAll(".legend")
    .data(z.domain().slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", z);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });

});

