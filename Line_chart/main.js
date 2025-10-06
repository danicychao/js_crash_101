const today = new Date();
const past = new Date();

past.setDate(today.getDate() - 30);

const formatDate = d => d.toISOString().split('T')[0];

const api = `https://archive-api.open-meteo.com/v1/archive?latitude=25.0330&longitude=121.5654&start_date=${formatDate(past)}&end_date=${formatDate(today)}&daily=temperature_2m_mean&timezone=Asia/Taipei`;

document.addEventListener("DOMContentLoaded", function(event) {
    fetch(api)
        .then(response => response.json())
        .then(function(data) {
            const parsedData = parseData(data);
            drawChart(parsedData);
        })
        .catch(err => console.log(err))
});

function parseData(data) {

    const dates = data.daily.time;
    const temps = data.daily.temperature_2m_mean;

    return temps.map((t, i) => ({
        date: new Date(dates[i]),
        value: t
    }));
}

function drawChart(data) {
    const svgWidth = 800, svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    
    const svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3.scaleTime()
        .rangeRound([0, width]);
    
    const y = d3.scaleLinear()
        .rangeRound([height, 0]);
    
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    const formatTime = d3.timeFormat("%-m/%-d");
        
    x.domain(d3.extent(data, d => d.date ));
    y.domain(d3.extent(data, d => d.value ));
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(formatTime))
        .select(".domain")
        .remove();
    
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Degree (°C)");
    
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }

