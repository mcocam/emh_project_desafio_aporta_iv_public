import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { getJenksFromArray } from "../../../../../../functions/getJenksFromArray";
import prettifyNumber from "../../../../../../functions/prettifyNumber";
import { roundTo } from "round-to";
import { getScaleColor } from "../../../../../../functions/getScaleColors";
import { getEqualBreaks } from "../../../../../../functions/getEqualBreaks";



export const MapLeaflet = ({data, level, selectedEntity}) => {

    const [mapInstance, setMapInstance] = useState(null);

    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const legendRef = useRef(null);
    useEffect(() => {

        const smoothFactor = 0;

        const leafletStyles = (feature) => {

            if (level === "Provincias"){
                const isSelected = feature.properties.provincia === selectedEntity;

                if (isSelected){
                    return{
                        fillColor: feature.value === 0 ? 'white' : feature.color,
                        weight: 0.8,
                        opacity: 1,
                        color: 'black',
                        fillOpacity: 0.7
                    }

                }else{
                    return{
                        fillColor: feature.value === 0 ? 'white' : feature.color,
                        weight: 0.2,
                        opacity: 1,
                        color: 'grey',
                        fillOpacity: 0.4
                    }
                }

            }else{
                const isSelected = feature.properties.ccaa === selectedEntity;

                if (isSelected){
                    return{
                        fillColor: feature.value === 0 ? 'white' : feature.color,
                        weight: 0.8,
                        opacity: 1,
                        color: 'black',
                        fillOpacity: 0.7
                    }

                }else{
                    return{
                        fillColor: feature.value === 0 ? 'white' : feature.color,
                        weight: 0.2,
                        opacity: 1,
                        color: 'grey',
                        fillOpacity: 0.4
                    }
                }
            }
        }

        // Jenks Natural Breaks and colors
        // const breaks = getJenksFromArray(data.mapData.map(d => d.metric), 5);
        // Equal ranges
        const breaks = getEqualBreaks(data.mapData.map(d => d.metric),5);
        const valueColors = getScaleColor(data.mapData, breaks, ['#fde725','#5ec962','#21918c','#3b528b','#440154']);

        const mapData = data.features.map((d, i) => {

            let targetIndex;
            if (level === "Provincias"){
                targetIndex = valueColors.id.indexOf(d.properties.provincia);
            }else{
                targetIndex = valueColors.id.indexOf(d.properties.ccaa);
            }

            return ({
                ...d, 
                value: valueColors.data[targetIndex], 
                class: valueColors.class[targetIndex], 
                color: valueColors.color[targetIndex]})
        });

        // Leaflet Legend
        let legend = L.control({position: 'bottomright'});
        legend.onAdd = (map) => {
            const div = L.DomUtil.create('div', 'info legend');

            div.innerHTML += '<b>% Altas</b><br>';

            if (breaks.length > 1){

                for (let i = 0; i<breaks.length; i++){

                    if (i === 0){
                        div.innerHTML += '<i style="background:' + valueColors.scaleDict.color[i] + '"></i> ' + '<'+
                        prettifyNumber(roundTo(valueColors.scaleDict.maxValue[i],2))+"%<br>";
                    }else if (i === breaks.length-1){
                        div.innerHTML += '<i style="background:' + valueColors.scaleDict.color[i] + '"></i> ' + '+'+
                        prettifyNumber(roundTo(valueColors.scaleDict.maxValue[i-1],2))+'%';
                    }else if(i < breaks.length-1){
                        div.innerHTML += '<i style="background:' + valueColors.scaleDict.color[i] + '"></i> ' +
                        prettifyNumber(roundTo(valueColors.scaleDict.minValue[i],2)) + '% - ' + prettifyNumber(roundTo(valueColors.scaleDict.minValue[i+1],2)) + '%<br>';
                    }
                    
                }

            }

            return div;
        }

        // Leaflet popup GeoJson
        const onEachFeatureProvincias = (feature, layer) => {
            let value = prettifyNumber(roundTo(+feature.value, 2));
            if (+feature.value === 0){
                value = '--';
            }
            layer.bindPopup(
                `<b>Provincia</b>: ${feature.properties.provincia}<br><b>Valor</b>: ${value}%`
            )
        }

        const onEachFeatureCCAA = (feature, layer) => {
            let value = prettifyNumber(roundTo(+feature.value, 2));
            if (+feature.value === 0){
                value = '--';
            }
            layer.bindPopup(
                `<b>Comunidad</b>: ${feature.properties.ccaa}<br><b>Valor</b>: ${value}%`
            )
        }

        let onEachFeature;
        if (level === "Provincias"){
            onEachFeature = onEachFeatureProvincias;
        }else{
            onEachFeature = onEachFeatureCCAA;
        }

        // First running
        if (!mapInstance){

            mapRef.current = L
                            .map('descMapRef')
                            .setView([39.616775, -3.803790], 5);

            layerRef.current = L.geoJson(mapData, {style: leafletStyles, smoothFactor: smoothFactor, onEachFeature: onEachFeature}).addTo( mapRef.current );
            legendRef.current = legend.addTo(mapRef.current);
            setMapInstance(mapRef.current);
            return;
        }

        // When map already exists
        if (mapInstance){
            layerRef.current.remove();
            legendRef.current.remove();
            layerRef.current = L.geoJson(mapData, {style: leafletStyles, smoothFactor: smoothFactor, onEachFeature: onEachFeature}).addTo( mapRef.current );
            legendRef.current = legend.addTo(mapRef.current);
            return;
        }


    }, [data.mapData.map(d => d.indicator), level]);

    return(

        <Box style={{height: '20rem'}}>
            <div id='descMapRef'/>
        </Box>

    )

}