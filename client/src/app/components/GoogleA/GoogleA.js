import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

export const GoogleA = () => {
    const location = useLocation();

    useEffect(() => {
        ReactGA.initialize("UA-243910965-1");
        ReactGA.pageview(location.pathname + location.search);
    }, [location]);
};