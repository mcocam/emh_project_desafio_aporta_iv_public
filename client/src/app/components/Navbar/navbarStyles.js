
const changeBodyColor = (color) => {
    document.body.style.backgroundColor = color;
}

const appBarStyles = {
    bgcolor: "white",
    color: "black"
}

const linkStyles = { 
    color: "black",
    fontSize: "0.75rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    ':hover': {
        bgcolor: "#F9F9F9",
        fontWeight: "bold"
    }
}

const logoButton = { 
    color: "black",
    ':hover': {
        bgcolor: "transparent"
    }
}

export {appBarStyles, linkStyles, logoButton, changeBodyColor};