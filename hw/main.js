//get file
d3.csv("data/Fortune 1000 Companies by Revenue.csv",type).then(
    res =>{
        ready(res);
        console.log('Local CSV:',res)
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
        profits:removeCommas(d.profits),
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
            d.profits &&
            d.profits 
            //
            // d.assets &&
            // d.market_value &&
            
            );
        }
    );
}
function prepareBarChartData(data){
    console.log(data);
    const dataMap = d3.rollup(
        data,
        v => d3.sum(v, leaf => leaf.profits),
        d => rankGroup = Math.ceil(d.rank / 5) // 將 rank 分組，每 5 名分為一組
    );
    const dataArray = Array.from(dataMap, d=>({rankGroup:`${(d[0]-1)*5+1}~${d[0]*5}`, profits:d[1]})); // 計算每一組的  總和
    return (dataArray);
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
            return d3.descending(a.profits,b.profits);
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
        const xExtent=d3.extent(barChartData, d=>d.profits);
        const xScale_v1 =d3.scaleLinear().domain(xExtent).range([0,chart_width]);
        //V2.0 ~ max
        const xMax=d3.max(barChartData, d=>d.profits);
        const xScale_v2 =d3.scaleLinear().domain([0, xMax]).range([0,chart_width]);
        //V3.Short writing for v2
        const xScale_v3 =d3.scaleLinear([0,xMax],[0, chart_width]);
//垂直空間的分配-平均分布給各種類
    const yScale=d3.scaleBand().domain(barChartData.map(d=>d.rankGroup))
        .rangeRound([0, chart_height])
        .paddingInner(0.25); //括號內放0~1 代表y之間距離比例

    // Draw bars
    const bars = this_svg.selectAll(".bars")
                    .data(barChartData)
                    .enter()
                    .append('rect')
                    .attr('class','bars')
                    .attr('x',0)
                    .attr('y',d=>yScale(d.rankGroup))
                    .attr('width',d=>xScale_v3(d.profits))
                    .attr('height',yScale.bandwidth())
                    .style('fill','pink') //自訂顏色 https://www.w3schools.com/colors/colors_names.asp
    
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
    .text('Total profits');

    const yAxisLabel = this_svg.append('text')
    .attr('class', 'axis-label')
    // .attr('transform', `rotate(-90) translate(-${chart_height / 2 }, ${-chart_margin.left * 0.5})`)
    .attr('x',`${-chart_margin.left * 0.95}`)
    .text('Rank group');

//Draw header
    const header = this_svg.append('g').attr('class','bar-header')
                .attr('transform',`translate(0,${-chart_margin.top/2})`)
                .append('text');
    header.append('tspan').text('Total profits by rankGroup in world\'s Top 100 companies')
            .style('font-size','1.1em');
    header.append('tspan').text('Data from kaggle, Year:2021')
            .attr('x',130).attr('y',20).style('font-size','0.8em').style('font-weight', 'bold').style('fill','#555');
}

