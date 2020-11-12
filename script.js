d3.csv('driving.csv', d3.autoType).then(data=>{
    const driving = data;
    console.log(driving)
    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 750 - margin.left - margin.right,
        height = 750 - margin.top - margin.bottom

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const xScale = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) {return +d.miles})).nice()
                    .range([0, width]);
    
    const yScale = d3.scaleLinear()
                    .domain(d3.extent(data, function(d) {return +d.gas})).nice()
                    .range([height, 0]);
    
    const xAxis = d3.axisBottom()
                    .scale(xScale);
                
    const yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10, "s")
                    .tickFormat(function(d) { return "$" + d3.format(".2f")(d)});
    
    svg.append("g")
                    .attr("class", "axis x-axis")
                    .call(xAxis)
                    .attr("transform", `translate(0, ${height})`)
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line")
                                            .clone()
                                            .attr("y2", -height)
                                            .attr("stroke-opacity", .1))
                   
    svg.append("g")
                    .attr("class", "axis y-axis")
                    .call(yAxis)
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line")
                                            .clone()
                                            .attr("x2", width)
                                            .attr("stroke-opacity", .1))

    svg.append('g')
                    .selectAll("dot")
                    .data(data)
                    .enter()
                    .append("circle")
                      .attr("cx", function (d) { return xScale(d.miles); } )
                      .attr("cy", function (d) { return yScale(d.gas); } )
                      .attr("r", 4)
                      .style("stroke", "black")
                      .style("fill", "none");

    var labels = svg.selectAll('.dots').data(data).enter().append("text")
                .attr("x", function (d) { return xScale(d.miles); } )
                .attr("y", function (d) { return yScale(d.gas); } )
                .text(function(d){return d.year})
                .style('font-size', '9px')
    
    svg.selectAll("text")
        .each(function position(d) {
            const t = d3.select(this);
            switch (d.side) {
              case "top":
                t.attr("text-anchor", "middle").attr("dy", "-0.7em");
                break;
              case "right":
                t.attr("dx", "0.5em")
                  .attr("dy", "0.32em")
                  .attr("text-anchor", "start");
                break;
              case "bottom":
                t.attr("text-anchor", "middle").attr("dy", "1.4em");
                break;
              case "left":
                t.attr("dx", "-0.5em")
                  .attr("dy", "0.32em")
                  .attr("text-anchor", "end");
                break;
            }
          })
          .call(halo)

    const line = d3
                .line()
                .x(d => xScale(d.miles))
                .y(d => yScale(d.gas))

    svg.append("path")
        .datum(driving)
        .transition()
        .duration(100)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", "2")
        .attr("d", line)

          function halo(text) {
            text
              .select(function() {
                return this.parentNode.insertBefore(this.cloneNode(true), this);
              })
              .attr("fill", "none")
              .attr("stroke", "white")
              .attr("stroke-width", "2")
              .attr("stroke-linejoin", "round");
            }
    
    svg.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .text("Cost per gallon")
    
    svg.append("text")
            .attr("x", width-175)
            .attr("y", height-10)
            .text("Miles per person per year")
})