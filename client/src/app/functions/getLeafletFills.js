

export const getLeafletFills = (valueColors) => {

    const styleArray = valueColors.color.map(d => {
        return (
            {
                fillColor: d,
                weight: 1,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            }
        )
    })

    return styleArray;

}