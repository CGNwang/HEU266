import { useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ChangePasswordPage,
  WaitingPage,
  MatchSuccessPage,
  MatchFailPage,
  MatchReportPage,
  ChatRoomPage,
  QuestionnairePage,
  ProfilePage,
  QuestionnaireRequiredPage,
  SecurityPage,
  BindInfoPage,
  DonatePage,
} from '@/components/pages';

const ScrollToTopOnNavigate = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return <Outlet />;
};

// 路由配置
export const router = createBrowserRouter([
  {
    element: <ScrollToTopOnNavigate />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'questionnaire',
            element: <QuestionnairePage />,
          },
          {
            path: 'questionnaire/:moduleId',
            element: <QuestionnairePage />,
          },
          {
            path: 'waiting',
            element: <WaitingPage />,
          },
          {
            path: 'questionnaire-required',
            element: <QuestionnaireRequiredPage />,
          },
          {
            path: 'match-success',
            element: <MatchSuccessPage />,
          },
          {
            path: 'match-fail',
            element: <MatchFailPage />,
          },
          {
            path: 'match-report',
            element: <MatchReportPage />,
          },
          {
            path: 'chat',
            element: <ChatRoomPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'security',
            element: <SecurityPage />,
          },
          {
            path: 'bind-info',
            element: <BindInfoPage />,
          },
          {
            path: 'donate',
            element: <DonatePage />,
          },
        ],
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        // 捕获所有未匹配路由，重定向到首页
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;