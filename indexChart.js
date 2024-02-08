async function main(){
    let data = await loadData();

    // organize data needed
    let organizedData = await organizeData(data);

    console.log(organizedData);

    const balanceBarChartData =  {
        chart: 
            {
                type: 'bar',
                height:"100%"
            },
    
    
        series:
            [   
                {
                    name: "Expenditure",
                    data: organizedData.expenditureData,
                },
                {
                    name: 'Income',
                    data: organizedData.incomeData,
                }
            ],
    
        xaxis: 
            {
            categories: organizedData.dataAxis.slice(0, organizedData.incomeData.length)
            },

        colors:['rgb(255, 87, 87)', '#8FACB1']
    }

    const spendingsLineChartData =  {
        chart: 
            {
                type: 'area',
                height:"100%"
            },
    
    
        series:
            [   
                {
                    name: "Shopping",
                    data: organizedData.spendingsData.shopping
                },
                {
                    name: 'Food',
                    data: organizedData.spendingsData.food
                },
                {
                    name: 'Transport',
                    data: organizedData.spendingsData.transport
                },
                {
                    name: 'Bill',
                    data: organizedData.spendingsData.bill
                }
            ],
    
        xaxis: 
            {
            categories: organizedData.dataAxis
            },

        colors:['#9588D0', 'rgb(255, 87, 87)', '#043380', '#8FACB1']
    }

    
    
    // create the chart
    const balanceBarChart = new ApexCharts(document.querySelector('#balance-bar-chart'), balanceBarChartData);
    const spendingsLineChart = new ApexCharts(document.querySelector('#spendings-line-chart'), spendingsLineChartData);
    
    // render the chart
    balanceBarChart.render();
    spendingsLineChart.render()
}

main();