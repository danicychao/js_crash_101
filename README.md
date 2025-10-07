# Javascript data visualization practices

This repo contains my Javascript (JS) notes and practices for data visualization. At the moment (Oct. 7), I am still a JS beginner, and only d3.js is used here. 
Most of the work in this repo is mainly done through ***AI-assisted coding in Cursor***.  

- [Line chart:](https://github.com/danicychao/js_crash_101/tree/main/Line_chart): A line chart of past 30-day temperatures, fetched from open-meteo's API.
- [Coffee waiting time:](https://github.com/danicychao/js_crash_101/tree/main/coffee_waiting_time): Line chart and bar chart of coffee waiting times.

## Note to myself
Main procedures of making charts in JS:

```document.addEventListener("DOMContentLoaded", function(event)```

1. Fetch in data: use `fetch(api)` to fetch, and `api` is the link of data; use `response => response.json()` or `response => response.text()`
   depends on data type.

2. Parse data: Go to the api link to inspect the data format, and write `parseData` function to parse the data. Use `map` method one or multiple time(s),
   `return` one or multiple time(s).

    - json: data.[STRUCTURE].[LOCATION]
    - txt: `.split('\n')` then `.split(',')` (it depends). Multiple `map` and multiple `return`

3. Plot data: Create container class in html for chart; write plotting function; inside the plotting function, set size of plotting area, create svg object with `d3.select`,
   use `svg.append` to plot data and axis.

    - `d3.scaleTime`, `d3.scaleLiner`, `d3.scalePoint`, `d3.scaleBand`
    - `d3.line`, `svg.selectAll('.dot').data(data)`

   Since writing plotting function is JS is tedious, the better way to do it is asking AI to first write the plotting function according to the prompts (chart type, data format), and then to tune the parameters for size, color, labels, and etc.. Using AI to set the CSS file is also highly recommended!

