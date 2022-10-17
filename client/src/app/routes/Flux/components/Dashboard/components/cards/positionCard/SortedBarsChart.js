
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Chart from 'chart.js/auto';
import {roundTo} from 'round-to';
import prettifyNumber from "../../../../../../../functions/prettifyNumber";

export const SortedBarsChart = ({data, selectedEntity}) => {
    const chartConfig = {
        type: 'bar',

        data: {
            labels: data.map(d => d.entity),
            datasets: [{
                label: 'Altas: ',
                data: data.map(d => roundTo(+d.metric, 2) ),
                backgroundColor: data.map(d => d.entity === selectedEntity ? '#1B2430' : '#D2DAFF'),
                tooltip: {
                    callbacks: {
                        label: (context) => {
    
                            const label = 'Altas';
                            const value = context.raw;
            
                            const percentage = prettifyNumber(value,2) + '%';
                            return label + ": " + percentage;
                        }
                    }
                }
            }]
        },

        options: {
            locale: 'de-DE',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                
                legend: {display: false},
                tooltip: {
                    displayColors: false
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
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                        color: 'black',
                        font: {
                            size: data.map(d => d.entity === selectedEntity ? 11 : 8),
                            weight: data.map(d => d.entity === selectedEntity ? 'bold' : '')
                        }
                    }
                }
            }
        }
    };
    
    const chartContainer = useRef(null); 
    const [chartInstance, setChartInstance] = useState(null);
    
    useEffect( () => {

        if (chartInstance && data){
            chartInstance.data.labels = data.map(d => d.entity);
            chartInstance.data.datasets[0].data = data.map(d => roundTo(+d.metric, 2) );
            chartInstance.data.datasets[0].backgroundColor = data.map(d => d.entity === selectedEntity ? '#1B2430' : '#D2DAFF');
            chartInstance.options.scales.x.ticks.font.size = data.map(d => d.entity === selectedEntity ? 11 : 8);
            chartInstance.options.scales.x.ticks.font.weight = data.map(d => d.entity === selectedEntity ? 'bold' : '');
            chartInstance.update();
            return;
        }

        if (chartContainer && chartContainer.current && !chartInstance){
            const newChartInstance = new Chart(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, 
    [chartContainer, selectedEntity, data] );

    return(
        <Box sx={{height: '14.1445rem'}}>
            <canvas ref={chartContainer} />
        </Box>
    )

}