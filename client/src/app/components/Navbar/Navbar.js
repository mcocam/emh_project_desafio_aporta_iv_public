import {Box} from '@mui/material';
import LargeScreenNavBar from './components/LargeScreenNavBar';
import SmallScreenNavBar from './components/SmallScreenNavBar';

const Navbar = () => {

    return(
        <>
            <LargeScreenNavBar />
            <SmallScreenNavBar />
            <Box sx={{height: "75px"}}/>
        </>
    )

}

export default Navbar;