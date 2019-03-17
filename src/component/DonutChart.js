function DonutChart() {
  let data = [],
    width,
    height,
    margin = {top: 10, right: 10, bottom: 10, left: 10},
    lightColor,
    darkColor,
    variable,
    category,
    sales,
    updateData,
    type,
    total,
    floatFormat = d3.format('.4r');

  function chart(selection){
    selection.each(function() {
      let radius = Math.min(width, height) / 2;

      // creates a new pie generator
      let pie = d3.pie()
        .value(function(d) { return floatFormat(d[variable]); })
        .sort(null);

      let arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.72)

      // this arc is used for aligning the text labels
      let outerArc = d3.arc()
          .outerRadius(radius * 0.9)
          .innerRadius(radius * 0.9);
      let svg = selection.append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      // g elements to keep elements within svg modular
      svg.append('g').attr('class', 'slices');

      // add and colour the donut slices
      let path = svg.select('.slices')
          .selectAll('path')
          .data(pie(data))
          .enter().append('path')
          .attr('fill', function(d) { 
            let color;
            if (darkColor !== undefined) {
              color = darkColor;
              darkColor = undefined;
            } else {
              color = lightColor;
            }
            return color;
          })
          .attr('d', arc);

      updateData = function(height, width) {

        let svgWidth = width, svgHeight = height;

        let x = d3.scaleLinear()
          .rangeRound([0, 170]);
      
        let y = d3.scaleLinear()
          .rangeRound([94.5, 0]);
      
        let line = d3.line()
          .x(function (d) {
            return x(d.date)
          })
          .y(function (d) {
            return y(d.value);
          })
          x.domain(d3.extent(sales, function (d) { return d.date }));
          y.domain(d3.extent(sales, function (d) { return d.value }));
          
        let area = d3.area()
          .x(function(d) { return x(d.date); })
          .y0(svgHeight)
          .y1(function(d) { return y(d.value); });
        
        let innerSvg = svg.append('g')
          .attr('clip-path', 'circle(47% at 47% 42%)')
          .attr('transform', 'translate(' + '-80' + ',' + '-16' + ')');
      
      
        innerSvg.append('text')
          .attr('class', 'toolCircle')
          .attr('dy', -20) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
          .attr('dx', -80)
          .attr('fill', 'grey')
          .html(centerText(type.toUpperCase())) // add text to the circle.
          .style('font-size', '0.9em')
          .style('text-transform', 'uppercase')
          .style('text-anchor', 'middle');

        innerSvg.append('text')
          .attr('class', 'toolCircle')
          .attr('dy', -4) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
          .attr('dx', -80) 
          .html(centerValue(total)) // add text to the circle.
          .style('font-size', '1.1em')
          .style('text-transform', 'uppercase')
          .style('text-anchor', 'middle');
      
        innerSvg.append('path')
          .datum(sales)
          .attr('fill', lightColor)
          .attr('fill-opacity', 0.1)
          .attr('stroke', lightColor)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 1.7)
          .attr('stroke-opacity', 0.7)
          .attr('d', line);
      };

      updateData(height, width);

      function centerText(data) {
        return `<tspan x="162">${data}</tspan>`;
      }

      function centerValue(data) {
        return `<tspan x="162">${data}</tspan>`;
      }

    });
  }

  chart.width = function(value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function(value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.margin = function(value) {
    if (!arguments.length) return margin;
    margin = value;
    return chart;
  };

  chart.radius = function(value) {
    if (!arguments.length) return radius;
    radius = value;
    return chart;
  };

  chart.sales = function(value) {
    if (!arguments.length) return sales;
    sales = value;
    return chart;
  };

  chart.total = function(value) {
    if (!arguments.length) return total;
    total = value;
    return chart;
  };

  chart.type = function(value) {
    if (!arguments.length) return type;
    type = value;
    return chart;
  };

  chart.lightColor = function(value) {
    if (!arguments.length) return lightColor;
    lightColor = value;
    return chart;
  };

  chart.darkColor = function(value) {
    if (!arguments.length) return darkColor;
    darkColor = value;
    return chart;
  };

  chart.variable = function(value) {
    if (!arguments.length) return variable;
    variable = value;
    return chart;
  };

  chart.category = function(value) {
    if (!arguments.length) return category;
    category = value;
    return chart;
  };

  chart.data = function(value) {
    if (!arguments.length) return data;
    data = value;
    if (typeof updateData === 'function') updateData();
    return chart;
  };

  return chart;
}