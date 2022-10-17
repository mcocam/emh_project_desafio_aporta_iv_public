import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Chart from 'chart.js/auto';
import prettifyNumber from "../../../../../../functions/prettifyNumber";
import { roundTo } from "round-to";

export const PopPyramidChart = ({data}) => {

    let maleSeries = data.datasets[1].data.map(d => d*-1);

    let maxF = Math.max( ...data.datasets[0].data  );
    let maxM = Math.max( ...maleSeries );
    let maxSeries = Math.max(maxF, maxM)*1.3;
    maxSeries = Math.round(maxSeries/1000)*1000;


    const chartConfig = {
        type: 'bar',
        data: data,
        options: {
            locale: 'de-DE',
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            interaction: {mode: 'y'},
            scales: {
                x: {
                    stacked: true,
                    min: maxSeries*-1,
                    max: maxSeries,
                    ticks: {
                        callback: (value, index, values) => {
                            return prettifyNumber(Math.abs(value));
                        }
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    reverse: true
                }
            },
            plugins: {
                tooltip: {
                    textAlign: 'center',
                    callbacks: {
                        label: (context) => {
                            let yValue = 0;
                            if (context.raw<0){
                                yValue = context.raw*-1;
                            }else{
                                yValue = context.raw;
                            }

                            yValue = prettifyNumber(roundTo(yValue, 3));

                            return `${context.dataset.label}: ${yValue}`;
                        }
                    }
                }
            }
        }
    } 
    

    const chartContainer = useRef(null); 
    const [chartInstance, setChartInstance] = useState(null);
    
    useEffect( () => {

        if (chartInstance && data){
            
            maleSeries = data.datasets[1].data.map(d => d*-1);

            maxF = Math.max( ...data.datasets[0].data  );
            maxM = Math.max( ...maleSeries );
            maxSeries = Math.max(maxF, maxM)*1.3;
            if (maxSeries<15){
                maxSeries = 20;
            }

            switch (true){
                case (maxSeries >= 1000):
                    maxSeries = Math.round(maxSeries/1000)*1000;
                    break;

                case (maxSeries >= 100 && maxSeries < 1000):
                    maxSeries = Math.round(maxSeries/100)*100;
                    break;

                case (maxSeries < 100):
                    maxSeries = Math.round(maxSeries/10)*10;
                    break;
            }

            chartInstance.data.datasets[0].data = data.datasets[0].data;
            chartInstance.data.datasets[0].backgroundColor = data.datasets[0].backgroundColor;
            chartInstance.data.datasets[0].borderColor = data.datasets[0].borderColor;

            chartInstance.data.datasets[1].data = data.datasets[1].data;
            chartInstance.data.datasets[1].backgroundColor = data.datasets[1].backgroundColor;
            chartInstance.data.datasets[1].borderColor = data.datasets[1].borderColor;

            chartInstance.options.scales.x.min = maxSeries*-1;
            chartInstance.options.scales.x.max = maxSeries;

            chartInstance.update();
            return;
        }

        if (chartContainer && chartContainer.current && !chartInstance){
            const newChartInstance = new Chart(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, 
    [chartContainer, data] );

    return(
        <Box sx={{height: '20rem'}}>
            <canvas ref={chartContainer} />
        </Box>
    )
}