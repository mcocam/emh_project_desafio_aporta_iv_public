import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Chart from 'chart.js/auto';
import {roundTo} from 'round-to';


export const MorbiditySeriesChart = ({data}) => {

    const chartConfig = {
        type: 'bar',

        data: {
            labels: data.top10.map(d => d.ccsr),
            datasets: [{
                label: 'Altas: ',
                data: data.top10.map(d => roundTo(+d.discharges, 0) ),
                backgroundColor: 'black'
            }]
        },

        options: {
            locale: 'de-DE',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                
                legend: {display: false},
                tooltip: {
                    displayColors: false,
                    callbacks: {
                        title: (t) => {
                            const wrap = (s) => s.replace(
                                /(?![^\n]{1,35}$)([^\n]{1,35})\s/g, '$1\n'
                            );
                            return wrap(t[0].label);
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: false,
                    grid: {display: false,
                            borderWidth: 0},
                    beginAtZero: true
                },
                x: {
                    display: false,
                    grid: {display: false,
                            borderWidth: 0}
                }
            }
        }
    };
    
    const chartContainer = useRef(null); 
    const [chartInstance, setChartInstance] = useState(null);
    
    useEffect( () => {

        if (chartInstance && data){
            chartInstance.data.labels = data.top10.map(d => d.ccsr);
            chartInstance.data.datasets[0].data = data.top10.map(d => roundTo(+d.discharges, 0) );
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
        <Box sx={{height: '6rem'}}>
            <canvas ref={chartContainer} />
        </Box>
    )

}