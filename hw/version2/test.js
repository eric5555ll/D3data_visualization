//get file
d3.csv("Fortune 1000 Companies by Revenue.csv",type).then(
  res =>{
      ready(res);
      // console.log('Local CSV:',res)
  }
);
const parseNA = String => (String === 'NA' ? undefined : String)

function removeCommas(str) {
  const stringWithoutCommas = str.replace(/,/g, '');
  return Number(stringWithoutCommas);
}

function type(d){
  return{rank:+d.rank,
      name:   d.name ,
      revenues:removeCommas(d.revenues),
      revenue_percent_change:parseNA(d.revenue_percent_change),
      profits:removeCommas(d.profits),
      profits_percent_change:parseNA(d.profits_percent_change),
      assets:removeCommas(d.assets),
      market_value:removeCommas(d.market_value),
      change_in_rank:parseNA(d.change_in_rank),
      employees:removeCommas(d.employees),
  }
}
//Data selection
function filterData(data){
  return data.filter(
      d=>{
      return(
          d.rank <=100 &&
          d.name &&
          d.revenues  &&
          // d.profits &&
          // d.assets &&
          // d.market_value &&
          d.employees 
          );
      }
  );
}
function prepareBarChartData(data){
  console.log(data);
  const histogram = d3.histogram()
  .value(d => d.employees)
  .thresholds(20);

  const bins = histogram(data);

  const dataMap = d3.rollup(
    data,
    v => d3.sum(v, leaf => leaf.revenues),
    d => Math.floor(d.employees / bins[0].x1) // 計算每個數據點屬於哪個區間
  );

const dataArray = Array.from(dataMap, d => ({ employeesGroup: `${bins[d[0]].x0}~${bins[d[0]].x1}`, revenues: d[1] }));
 // 計算每一組的 revenue 總和
  return dataArray;
}
//
// function prepareBarChartData(data){
//     console.log(data);
//     const dataMap = d3.rollup(
//         data,
//         v => d3.sum(v, leaf => leaf.revenues),//將revenue加總
//         d => d.name//依電影分類groupby
//     );
//     const dataArray = Array.from(dataMap, d=>({name:d[0], revenues:d[1],}));
//     return dataArray;
// }
// main
function ready(companys){
  const companysClean = filterData(companys);
  const barChartData = prepareBarChartData(companysClean).sort(
      (a,b)=>{
          return d3.descending(a.revenues,b.revenues);
      }
  );
  console.log(barChartData);
  setupCanvas(barChartData);
}


function setupCanvas(barChartData){
  const svg_width=600;
  const svg_height=600;
  const chart_margin={top:80,right:40,bottom:40,left:100};
  const chart_width=svg_width-(chart_margin.left+chart_margin.right);
  const chart_height=svg_height-(chart_margin.top+chart_margin.bottom);
  
  const this_svg=d3.select('.bar-chart-container').append('svg')
      .attr('width', svg_width).attr('height',svg_height)
      .append('g')
      .attr('transform',`translate(${chart_margin.left},${chart_margin.top})`);
      
      //scale
      //V1.d3.extent find the max & min in revenue
      const xExtent=d3.extent(barChartData, d=>d.revenues);
      const xScale_v1 =d3.scaleLinear().domain(xExtent).range([0,chart_width]);
      //V2.0 ~ max
      const xMax=d3.max(barChartData, d=>d.revenues);
      const xScale_v2 =d3.scaleLinear().domain([0, xMax]).range([0,chart_width]);
      //V3.Short writing for v2
      const xScale_v3 =d3.scaleLinear([0,xMax],[0, chart_width]);
//垂直空間的分配-平均分布給各種類
  const yScale=d3.scaleBand().domain(barChartData.map(d=>d.employeesGroup))
      .rangeRound([0, chart_height])
      .paddingInner(0.25);

  // Draw bars
  const bars = this_svg.selectAll(".bars")
                  .data(barChartData)
                  .enter()
                  .append('rect')
                  .attr('class','bars')
                  .attr('x',0)
                  .attr('y',d=>yScale(d.employeesGroup))
                  .attr('width',d=>xScale_v3(d.revenues))
                  .attr('height',yScale.bandwidth())
                  .style('fill','dodgerblue')
  
  const xAxis = d3.axisTop(xScale_v3)
                  // .tickFormat(formatTicks)
                  .tickSizeInner(-chart_height)
                  .tickSizeOuter(0);

  const xAxisDraw = this_svg.append('g')
                  .attr('class','x axis')
                  .call(xAxis);

  const yAxis = d3.axisLeft(yScale).tickSize(0);
  const yAxisDraw = this_svg.append('g')
                  .attr('class','y axis')
                  .call(yAxis);
  yAxisDraw.selectAll('text').attr('dx','-0.6em');

  //x y Label
  const xAxisLabel = this_svg.append('text')
  .attr('class', 'axis-label')
  .attr('x', chart_width / 3)
  .attr('y', chart_height + chart_margin.bottom * 0.5)
  .text('Total revenues');

  const yAxisLabel = this_svg.append('text')
  .attr('class', 'axis-label')
  // .attr('transform', `rotate(-90) translate(-${chart_height / 2 }, ${-chart_margin.left * 0.5})`)
  .attr('x',`${-chart_margin.left * 0.95}`)
  .text('Group');

//Draw header
  const header = this_svg.append('g').attr('class','bar-header')
              .attr('transform',`translate(0,${-chart_margin.top/2})`)
              .append('text');
  header.append('tspan').text('Total revenues by employeesGroup in world\'s Top 100 companys')
          .style('font-size','1.1em');
  // header.append('tspan').text('Years:2000-2009')
          // .attr('x',0).attr('y',20).style('font-size','0.8em').style('fill','#555');
}

