import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faFacebook, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faQuestion, faRss } from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;
library.add(faTwitter, faFacebook, faRss, faGithub, faCheck, faQuestion, faLightbulb);
