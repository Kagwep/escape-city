import { RouteNamesEnum } from 'localConstants';
import { Dashboard, Disclaimer, Home, Profile, RunAwaysManage, RunAways} from 'pages';
import { RouteType } from 'types';


interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: RouteNamesEnum.home,
    title: 'Home',
    component: Home
  },
  {
    path: RouteNamesEnum.dashboard,
    title: 'Dashboard',
    component: Dashboard
  },
  {
    path: RouteNamesEnum.disclaimer,
    title: 'Disclaimer', 
    component: Disclaimer
  },
  {
    path: RouteNamesEnum.profile,
    title: 'Profile',
    component: Profile
  },
  {
    path: RouteNamesEnum.runaways,
    title: 'Runaways Manage',
    component: RunAwaysManage
  },
  {
    path: RouteNamesEnum.play,
    title: 'Play',
    component: RunAways
  }
];
