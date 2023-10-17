import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

export const GoogleA = () => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize("G-S5QFTRLRN1");
        //ReactGA.pageview(location.pathname + location.search);
        
        ReactGA.pageview(location.pathname + location.search);
        //ReactGA.pageview(location.pathname + location.search);
    }, [location]);
};