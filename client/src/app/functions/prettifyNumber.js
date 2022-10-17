const prettifyNumber = (n) => {

    if (Number(n)){
        return n.toLocaleString('de-DE');
    }else{
        return 0;
    }
    

}

export default prettifyNumber;