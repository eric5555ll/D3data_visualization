const parseNA = string => (string === '' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);
function formatTicks(d){ 
    
    return d3.format('~s')(d) 
        .replace('M','mil') 
        .replace('G','bil') 
        .replace('T','tri')
}
// export function setBarChartCanvas(data,region) {
//   const svgWidth = 700;
//   const svgHeight = 500;
//   const margin = { top: 40, right: 40, bottom: 40, left: 150 };
//   const chartWidth = svgWidth - margin.left - margin.right;
//   const chartHeight = svgHeight - margin.top - margin.bottom;

//   const filteredData = data.filter(d => d[region] > 0)
//     .sort((a, b) => b[region] - a[region])
//     .slice(0, 20);

// const svg = d3.select('#bar-chart-container')
//     .append('svg')
//     .attr('width', svgWidth)
//     .attr('height', svgHeight);

//   const chart = svg.append('g')
//     .attr('transform', `translate(${margin.left},${margin.top})`);

//   const xScale = d3.scaleLinear()
//     .domain([0, d3.max(filteredData, d => d[region])])
//     .range([chartHeight, 0]);

//   const yScale = d3.scaleBand()
//     .domain(filteredData.map(d => d.publisher))
//     .range([0, chartWidth])
//     .paddingInner(0.1);

//   const xAxis = d3.axisBottom(xScale);
//   chart.append('g')
//     .attr('transform', `translate(0,${chartHeight})`)
//     .call(xAxis);

//   const yAxis = d3.axisLeft(yScale);
//   chart.append('g')
//     .call(yAxis);

//   const bars = chart.selectAll('.bar')
//     .data(filteredData)
//     .enter()
//     .append('rect')
//     .attr('class', 'bar')
//     .attr('x', d => xScale(d[region]))
//     .attr('y', d => yScale(d.publisher))
//     .attr('width', xScale.bandwidth())
//     .attr('height', d => chartHeight - yScale(d[region])); 

//      // 更新下拉式選單的事件處理程序
//   d3.select('#region-select').on('change', function() {
//     const selectedRegion = this.value;
//     const filteredData = data.filter(d => d[selectedRegion] > 0)
//                              .sort((a, b) => b[selectedRegion] - a[selectedRegion])
//                              .slice(0, 20);
//     setBarChartCanvas(filteredData, selectedRegion); // 重新呼叫繪圖函式
//   });
// }


export function setBarChartCanvas(data, region) {
  const svgWidth = 700;
  const svgHeight = 500;
  const margin = { top: 80, right: 40, bottom: 40, left: 150 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // 移除舊的圖表元素
  d3.select('#bar-chart-container svg').remove();

  const filteredData = data.filter(d => d[region] > 0)
    .sort((a, b) => b[region] - a[region])
    .slice(0, 20);

  const svg = d3.select('#bar-chart-container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d[region])])
    .range([0, chartWidth]);

  const yScale = d3.scaleBand()
    .domain(filteredData.map(d => d.publisher))
    .range([0, chartHeight])
    .paddingInner(0.1);

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d => `${d }k`);
    // .tickFormat(formatTicks);
  
  chart.append('g')
    .attr('transform', `translate(0,${chartHeight})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  chart.append('g')
    .call(yAxis);

  // 設定顏色比例尺
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const bars = chart.selectAll('.bar')
    .data(filteredData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('y', d => yScale(d.publisher))
    .attr('width', d => xScale(d[region]))
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(d.publisher));

  // 添加圖表標題
  svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', svgWidth / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .text(`Top 20 Publishers for ${region}`);

// 添加 x 軸標籤
chart.append('text')
  .attr('class', 'unit-label')
  .attr('x', chartWidth -50 )
  .attr('y', chartHeight - margin.top +65 )
  .attr('text-anchor', 'middle')
  .text('Sales (in thousands)');

// 添加 y 軸標籤
chart.append('text')
  .attr('class', 'unit-label')
  .attr('x', -margin.left+85)
  .attr('y', -margin.top / 3)
  .attr('text-anchor', 'start')
  .text('Publisher');

// 調整 x 軸位置
chart.append('g')
  .attr('transform', `translate(0, ${chartHeight})`)
  .call(xAxis);

// 調整 y 軸位置
chart.append('g')
  .call(yAxis);

  // 更新下拉式選單的事件處理程序
  d3.select('#region-select').on('change', function() {
    const selectedRegion = this.value;
    const filteredData = data.filter(d => d[selectedRegion] > 0)
                             .sort((a, b) => b[selectedRegion] - a[selectedRegion])
                             .slice(0, 20);
    setBarChartCanvas(filteredData, selectedRegion); // 重新呼叫繪圖函式
  });
}












  
    // //Draw header
    // const header = this_svg.append('g')
    //     .attr('class', 'bar-header')
    //     .attr('transform', `translate(0,${-chart_margin.top / 2})`)
    //     .append('text');
    // header.append('tspan')
    //     .text(`Avg global_Sales by Genre`)
    //     .style('font-weight', 'bold');
    // header.append('tspan')
    //     .text('(every Thousand in US$)')
    //     .attr('x', 0)
    //     .attr('y', 20)
    //     .style('font-size', '0.8em')
    //     .style('fill', '#555');
    // header.append('tspan')
    //     .text(`(from ${originData['start']} to ${originData.end})`)
    //     .attr('x', 150)
    //     .attr('y', 20)
    //     .style('font-size', '0.8em')
    //     .style('fill', '#555');
  
    // const xAxis = d3.axisTop(xScale)
    //     .tickFormat(formatTicks)
    //     .tickSizeInner(-chart_height)
    //     .tickSizeOuter(0);
    // const xAxisDraw = this_svg.append('g')
    //     .attr('class', 'x axis')
    //     .call(xAxis);
    // const yAxis = d3.axisLeft(yScale)
    //     .tickSize(0);
    // const yAxisDraw = this_svg.append('g')
    //     .attr('class', 'y axis')
    //     .call(yAxis);
    // yAxisDraw.selectAll('text')
    //     .attr('dx', '-0.6em');

