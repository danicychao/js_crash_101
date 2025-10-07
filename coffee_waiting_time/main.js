
const api = 'https://raw.githubusercontent.com/danicychao/js_crash_101/refs/heads/main/coffee_waiting_time/data_waiting_time.txt'

document.addEventListener("DOMContentLoaded", function(event) {
    fetch(api)
        .then(response => response.text())
        .then(function(data) {
            const parsedData = parseData(data);
            drawLineChart(parsedData);
            drawBarChart(parsedData);
        })
        .catch(err => console.log(err))
});

function parseData(data) {

    const lines = data.trim().split('\n');

    return lines.map(single_line => {
        const [rawDate, rawWait] = single_line.split(',').map(s => s.trim());

        const [min, sec] = rawWait.split(':').map(Number);
        const totalTime = min * 60 + sec;

        return {
            date: rawDate,
            wait: totalTime
        };
    });

}

function drawLineChart(data) {
    const svgWidth = 1000, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    
    const svg = d3.select('#line-chart')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // const x = d3.scaleTime()
    //     .rangeRound([0, width]);

    const x = d3.scalePoint()
                .range([0, width])
                .padding(0.8);
    
    const y = d3.scaleLinear()
        .rangeRound([height, 0]);
    
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.wait));

    const xValues = data.map(d => d.date);    
    x.domain(xValues);
    y.domain([d3.min(data, d => d.wait) - 30, d3.max(data, d => d.wait) + 20]);
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(xValues))
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -7.25)
        .attr("y", -2.2)
        .style("text-anchor", "end");
        
    
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Waiting time (seconds)");
    
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // 🟢 Tooltip element
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid steelblue")
        .style("padding", "6px 10px")
        .style("border-radius", "6px")
        .style("font-size", "13px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.wait))
        .attr("r", 4)                   // circle radius
        .attr("fill", "steelblue")
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 6)
                .attr("fill", "orange");
            
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`<b>${d.date}</b><br/>Wait: ${d.wait} sec`)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 4)
                .attr("fill", "steelblue");
            
            tooltip.transition().duration(300).style("opacity", 0);
        });
    }

function drawBarChart(data) {
    // Create bins for the waiting time distribution
    const bins = createBins(data);
    const totalCount = data.length;
    
    const svgWidth = 1000, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 80, left: 80 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    
    const svg = d3.select('#bar-chart')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1)
        .domain(bins.map(d => d.range));
    
    const y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([0, d3.max(bins, d => d.count)]);
    
    // Add tooltip for bar chart
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "bar-tooltip")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid steelblue")
        .style("padding", "6px 10px")
        .style("border-radius", "6px")
        .style("font-size", "13px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    
    // Create bars
    g.selectAll(".bar")
        .data(bins)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.range))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count))
        .attr("fill", "steelblue")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("fill", "orange");
            
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`<b>${d.range}</b><br/>${d.count} out of ${totalCount} times`)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(100)
                .attr("fill", "steelblue");
            
            tooltip.transition().duration(300).style("opacity", 0);
        });
    
    // Add x-axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");
        //.attr("transform", "rotate(-45)");
    
    // Add y-axis
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Count");
    
    // Add title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Distribution of Waiting Times");
}

function createBins(data) {
    // Extract waiting times
    const waitTimes = data.map(d => d.wait);
    
    // Define bin ranges (in seconds)
    const binRanges = [
        { min: 60, max: 90, label: "1-1.5 min" },
        { min: 90, max: 120, label: "1.5-2 min" },
        { min: 120, max: 150, label: "2-2.5 min" },
        { min: 150, max: 180, label: "2.5-3 min" },
        { min: 180, max: 240, label: "3-4 min" },
        { min: 240, max: 300, label: "4-5 min" },
        { min: 300, max: 360, label: "5-6 min" }
    ];
    
    return binRanges.map(range => {
        const count = waitTimes.filter(time => time >= range.min && time < range.max).length;
        return {
            range: range.label,
            count: count,
            min: range.min,
            max: range.max
        };
    });
}

