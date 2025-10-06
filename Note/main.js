// d3 manipulation
// d3.select();
// d3.selectAll();

// d3.select('h1').style('color', 'green');

// const dataset = [1, 2, 3, 4, 5];
// d3.select('body')
//   .selectAll('p')
//   .data(dataset)
//   .enter()
//   .append('p')
// //   .text('D3 is awesome!!');
//   .text(d => d);


// Bar chart
// d3.axisTop()
// d3.axisRight()
// d3.axisBottom()
// d3.axisLeft()

// const dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
// //const dataset = [1, 2, 3, 4, 5];

// const svgWidth = 500, svgHeight = 300, barPadding = 5;
// const barWidth = (svgWidth / dataset.length);

// const svg = d3.select('svg')
//               .attr("width", svgWidth)
//               .attr("height", svgHeight);

// // Scale and axis
// const xScale = d3.scaleLinear()
//                  .domain([0, dataset.length + 0.5])
//                  .range([0, svgWidth]);

// const yScale = d3.scaleLinear()
//                  .domain([0, d3.max(dataset) + 1])
//                  .range([svgHeight, 0]);

// const x_axis = d3.axisBottom().scale(xScale);
// const y_axis = d3.axisLeft().scale(yScale);

// svg.append("g")
//    .attr("transform", "translate(50, 10)")
//    .call(y_axis);

// const xAxisTranslate = svgHeight - 20;

// svg.append("g")
//    .attr("transform", "translate(50, " + xAxisTranslate +")")
//    .call(x_axis);

// const barChart = svg.selectAll("rect")
//                  .data(dataset)
//                  .enter()
//                  .append("rect")
//                  .attr("y", d => svgHeight - yScale(d))
//                  .attr("height", d => yScale(d))
//                  .attr("width", barWidth - barPadding)
//                  .attr("class", "bar")
//                  .attr("transform", function(d, i){
//                     const translate = [barWidth * i, 0];
//                     return "translate("+ translate +")";
//                  });

// const text = svg.selectAll("text")
//                 .data(dataset)
//                 .enter()
//                 .append("text")
//                 .text(d => d)
//                 .attr("y", d => svgHeight - yScale(d) - 1 )
//                 .attr("x", function(d, i){
//                     return barWidth * i;
//                 })
//                 .attr("fill", "#A64C38");



// line, rectangular, circle
// const svgWidth = 600, svgHeight = 500;
// const svg = d3.select("svg")
//               .attr("width", svgWidth)
//               .attr("height", svgHeight)
//               .attr("class", "svg-container");

// const line1 = svg.append("line")
//                 .attr("x1", 100)
//                 .attr("x2", 500)
//                 .attr("y1", 50)
//                 .attr("y2", 50)
//                 .attr("stroke", "red")
//                 .attr("stroke-width", 5);

// const line2 = svg.append("line")
//                 .attr("x1", 100)
//                 .attr("x2", 500)
//                 .attr("y1", 150)
//                 .attr("y2", 150)
//                 .attr("stroke", "red");

// const rect = svg.append("rect")
//                 .attr("x", 100)
//                 .attr("y", 100)
//                 .attr("width", 200)
//                 .attr("height", 40)
//                 .attr("fill", "#9895FF");

// const circle = svg.append("circle")
//                   .attr("cx", 200)
//                   .attr("cy", 300)
//                   .attr("r", 80)
//                   .attr("fill", "#7CE8D5");