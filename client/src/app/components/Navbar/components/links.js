import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HubIcon from '@mui/icons-material/Hub';

const linkList = [
    {
        path: "/",
        label: "Inicio",
        icon: SentimentSatisfiedAltIcon,
        bgColor: "#ffffff"
    },
    {
        path: "/desc",
        label: "Descriptivos",
        icon: LeaderboardIcon,
        bgColor: "#F4F4F4"
    },
    {
        path: "/kpi",
        label: "KPI",
        icon: AlignVerticalCenterIcon,
        bgColor: "#F4F4F4"
    },
    {
        path: "/flujo",
        label: "Flujos",
        icon: HubIcon,
        bgColor: "#F4F4F4"
    },
    {
        path: "/metodologia",
        label: "Metodología" ,
        icon: MenuBookIcon,
        bgColor: "#ffffff"
    }
];

export default linkList;