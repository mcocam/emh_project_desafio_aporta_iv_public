import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Chart from 'chart.js/auto';
import { parseISO, format } from 'date-fns';
import {es} from 'date-fns/locale/';
import { capitalize } from '@mui/material';
import {roundTo} from 'round-to';
import prettifyNumber from "../../../../../../../functions/prettifyNumber";


export const ExitusMonthlyChart = ({data}) => {

    const chartConfig = {
        type: 'line',

        data: {
            labels: data.map(d => capitalize(format(parseISO(d.month), 'MMMM-yy', {locale: es} ))),
            datasets: [{
                label: 'Exitus %',
                data: data.map(d => d.exitusPercentage ),
                fill: true,
                backgroundColor: "#F5F5F5", 
                borderColor: "#032D3C", 
                tension: 0.5 ,
                pointRadius: 4,
                tooltip: {
                    callbacks: {
                        label: (context) => {

                            const label = 'Exitus';
                            const value = context.raw*100;
            
                            const percentage = prettifyNumber(roundTo(value,2)) + '%';
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
                title: {text: "Meses",
                        display: false,
                        align: 'start',
                        position: 'bottom'},
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
            chartInstance.data.labels = data.map(d => capitalize(format(parseISO(d.month), 'MMMM-yy', {locale: es} )));
            chartInstance.data.datasets[0].data = data.map(d => d.exitusPercentage, 2);
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