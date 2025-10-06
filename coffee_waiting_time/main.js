
const api = 'https://raw.githubusercontent.com/danicychao/js_crash_101/refs/heads/main/coffee_waiting_time/data_waiting_time.txt'

document.addEventListener("DOMContentLoaded", function(event) {
    fetch(api)
        .then(response => response.text())
        .then(function(data) {
            const parsedData = parseData(data);
            drawChart(parsedData);
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

function drawChart(data) {
    const svgWidth = 1000, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    
    const svg = d3.select('svg')
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

