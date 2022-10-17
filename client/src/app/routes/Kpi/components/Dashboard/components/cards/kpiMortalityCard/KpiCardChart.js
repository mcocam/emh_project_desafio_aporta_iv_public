import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import {roundTo} from 'round-to';

Chart.register(annotationPlugin);

export const KpiCardChart = ({data, selectedEntity}) => {

    const sigLowerColor = 'rgba(47,137,252, 0.2)';
    const sigUpperColor = 'rgba(253,184,39, 0.2)';
    const noSigColor = 'rgba(255,255,255, 0.2)';

    const sigLowerColorSelected = 'rgba(47,137,252, 1)';
    const sigUpperColorSelected = 'rgba(253,184,39, 1)';
    const noSigColorSelected = 'rgba(255,255,255, 1)';

    const selectedEntityBorder = 'rgba(0,0,0,1)';
    const entityBorder = 'rgba(0,0,0,0.2)';

    const getBorderColors = (data) => {

        if (data === selectedEntity){
            return selectedEntityBorder;
        }else{
            return entityBorder;
        }

    }

    const getBackgroundColors = (ci_upper, ci_lower, targetEntity) => {

        if (ci_lower > 1 && ci_upper > 1){
            if (targetEntity === selectedEntity){
                return sigUpperColorSelected
            }else{
                return sigUpperColor
            }
        }else if (ci_lower < 1 && ci_upper < 1){
            if (targetEntity === selectedEntity){
                return sigLowerColorSelected
            }else{
                return sigLowerColor
            }
        }else{
            if (targetEntity === selectedEntity){
                return noSigColorSelected
            }else{
                return noSigColor
            }
        }
    }

    const chartConfig = {
        type: 'line',

        data: {
            labels: data.entitiesData.map(d => d.target_entities),
            datasets: [{
                label: 'Ratio',
                data: data.entitiesData.map(d => d.ratio),
                pointBackgroundColor: data.entitiesData.map(d => getBackgroundColors(d.ci95_upper, d.ci95_lower, d.target_entities )), 
                pointBorderColor: data.entitiesData.map(d => getBorderColors(d.target_entities)),
                borderWidth: 0,
                pointBorderWidth: 1
            }]
        },

        options: {
            locale: 'de-DE',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {text: "",
                        display: false,
                        align: 'start',
                        position: 'bottom'},
                legend: {display: false},
                tooltip: {displayColors: false},
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 1,
                            yMax: 1,
                            borderColor: 'grey',
                            borderWidth: 0.5
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: true,
                    grid: {display: false,
                            borderWidth: 0},
                    beginAtZero: true,
                    min: -0.5,
                    max: 2,
                    ticks: {
                        maxTicksLimit: 5,
                        stepSize: 0.5,
                        callback: (value, index, ticks) => {
                            if (index === 2){
                                return 1;
                            }
                        }
                    }
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
            chartInstance.data.labels = data.entitiesData.map(d => d.target_entities);
            chartInstance.data.datasets[0].data = data.entitiesData.map(d => d.ratio);
            chartInstance.data.datasets[0].pointBackgroundColor = data.entitiesData.map(d => getBackgroundColors(d.ci95_upper, d.ci95_lower, d.target_entities ));
            chartInstance.data.datasets[0].pointBorderColor = data.entitiesData.map(d => getBorderColors(d.target_entities));
            chartInstance.update();
            return;
        }

        if (chartContainer && chartContainer.current && !chartInstance){
            const newChartInstance = new Chart(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, 
    [chartContainer, data, selectedEntity] );


    return(
        <Box sx={{height: '6rem'}}>
            <canvas ref={chartContainer} />
        </Box>
    )

}