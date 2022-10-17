import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const contactLinks = [
    {
        href: "mailto:emh.project.1@gmail.com",
        label: "Contacto",
        icon: EmailIcon,
        disabled: false
    },
    {
        href: "https://www.linkedin.com/in/marccocamoreno/",
        label: "LinkedIn",
        icon: LinkedInIcon,
        disabled: false
    },
    {
        href: "https://github.com/mcocam/emh_project_desafio_aporta_iv_public",
        label: "Código",
        icon: GitHubIcon,
        disabled: false
    },
    {
        href: "https://github.com/",
        label: "Contribuye",
        icon: VolunteerActivismIcon,
        disabled: true
    }
]

export default contactLinks;