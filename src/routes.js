import RootComponent from 'RootComponent';
import App from 'components/App';
import Dashboard from 'pages/Dashboard/Dashboard';
import HomePage from 'pages/HomePage/HomePage';
import CannedMessageList from 'components/CannedMessageList';
import UserList from 'components/UserList';
import Reports from 'components/Reports';
import Report from 'components/Report';
import VoiceForwarding from 'components/VoiceForwarding';
import Payment from 'components/Payment';
import AccountSettings from 'components/AccountSettings';

export default {
  path: '/',
  component: RootComponent,
  indexRoute: { component: HomePage },
  childRoutes: [
    {
      path: 'app',
      component: App,
      indexRoute: { component: Dashboard },
      childRoutes: [
        {
          path: 'message-templates',
          component: CannedMessageList,
        },
        {
          path: 'users',
          component: UserList,
        },
        {
          path: 'voice-forwarding',
          component: VoiceForwarding,
        },
        {
          path: 'reports',
          component: Reports,
          indexRoute: { component: Report },
          childRoutes: [{
            path: ':reportId',
            component: Report,
          }],
        },
        {
          path: 'payment',
          component: Payment,
        },
        {
          path: 'account-settings',
          component: AccountSettings,
        },
      ],
    },
  ],
};
