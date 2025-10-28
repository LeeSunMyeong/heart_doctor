
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import PremiumHome from "../pages/home/premium/page";
import Login from "../pages/login/page";
import Signup from "../pages/signup/page";
import AccountRecovery from "../pages/account-recovery/page";
import Assessment from "../pages/assessment/page";
import VoiceAssessment from "../pages/assessment/voice/page";
import Result from "../pages/result/page";
import History from "../pages/history/page";
import Settings from "../pages/settings/page";
import NotificationSettings from "../pages/settings/notifications/page";
import LanguageSettings from "../pages/settings/language/page";
import InputMethodSettings from "../pages/settings/input-method/page";
import ThemeSettings from "../pages/settings/theme/page";
import Pricing from "../pages/pricing/page";
import Subscription from "../pages/pricing/subscription/page";
import Payment from "../pages/payment/page";
import PaymentHistory from "../pages/payment-history/page";
import AdminLogin from "../pages/admin/login/page";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminNotifications from "../pages/admin/notifications/page";
import Notifications from "../pages/notifications/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home/premium",
    element: <PremiumHome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/account-recovery",
    element: <AccountRecovery />,
  },
  {
    path: "/assessment",
    element: <Assessment />,
  },
  {
    path: "/assessment/voice",
    element: <VoiceAssessment />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "/result/:id",
    element: <Result />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/settings/notifications",
    element: <NotificationSettings />,
  },
  {
    path: "/settings/language",
    element: <LanguageSettings />,
  },
  {
    path: "/settings/input-method",
    element: <InputMethodSettings />,
  },
  {
    path: "/settings/theme",
    element: <ThemeSettings />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/pricing/subscription",
    element: <Subscription />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/payment-history",
    element: <PaymentHistory />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/notifications",
    element: <AdminNotifications />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
