import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Chart from 'chart.js/auto';
import { parseISO, format } from 'date-fns';
import {es} from 'date-fns/locale/';
import { capitalize } from '@mui/material';
import {roundTo} from 'round-to';


export const MonthSeries = ({data}) => {

    const chartConfig = {
        type: 'line',

        data: {
            labels: data.map(d => capitalize(format(parseISO(d.fecha_alta), 'MMMM-yy', {locale: es} ))),
            datasets: [{
                label: 'Altas',
                data: data.map(d => roundTo(+d.discharges, 0) ),
                fill: true,
                backgroundColor: "#F5F5F5",  
                borderColor: "#032D3C", 
                tension: 0.5 ,
                pointRadius: 4
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
                tooltip: {displayColors: false}
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
            chartInstance.data.labels = data.map(d => capitalize(format(parseISO(d.fecha_alta), 'MMMM-yy', {locale: es} )));
            chartInstance.data.datasets[0].data = data.map(d => roundTo(+d.discharges, 0) );
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
        <Box sx={{height: '6rem', marginLeft: '-2rem', marginRight: '-2rem'}}>
            <canvas ref={chartContainer} />
        </Box>
    )

}