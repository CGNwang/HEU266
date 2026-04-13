import { Suspense, lazy, useEffect } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { createBrowserRouter, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout';

const HomePage = lazy(() => import('@/components/pages/HomePage'));
const LoginPage = lazy(() => import('@/components/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/components/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/components/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/components/pages/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('@/components/pages/ChangePasswordPage'));
const WaitingPage = lazy(() => import('@/components/pages/WaitingPage'));
const MatchSuccessPage = lazy(() => import('@/components/pages/MatchSuccessPage'));
const MatchFailPage = lazy(() => import('@/components/pages/MatchFailPage'));
const MatchReportPage = lazy(() => import('@/components/pages/MatchReportPage'));
const ChatRoomPage = lazy(() => import('@/components/pages/ChatRoomPage'));
const QuestionnairePage = lazy(() => import('@/components/pages/QuestionnaireWrapper'));
const ProfilePage = lazy(() => import('@/components/pages/ProfilePage'));
const QuestionnaireRequiredPage = lazy(() => import('@/components/pages/QuestionnaireRequiredPage'));
const SecurityPage = lazy(() => import('@/components/pages/SecurityPage'));
const BindInfoPage = lazy(() => import('@/components/pages/BindInfoPage'));
const DonatePage = lazy(() => import('@/components/pages/DonatePage'));

const renderLazy = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-on-surface-variant">加载中...</div>}>
    <Component />
  </Suspense>
);

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
            element: renderLazy(HomePage),
          },
          {
            path: 'questionnaire',
            element: renderLazy(QuestionnairePage),
          },
          {
            path: 'questionnaire/:moduleId',
            element: renderLazy(QuestionnairePage),
          },
          {
            path: 'waiting',
            element: renderLazy(WaitingPage),
          },
          {
            path: 'questionnaire-required',
            element: renderLazy(QuestionnaireRequiredPage),
          },
          {
            path: 'match-success',
            element: renderLazy(MatchSuccessPage),
          },
          {
            path: 'match-fail',
            element: renderLazy(MatchFailPage),
          },
          {
            path: 'match-report',
            element: renderLazy(MatchReportPage),
          },
          {
            path: 'chat',
            element: renderLazy(ChatRoomPage),
          },
          {
            path: 'profile',
            element: renderLazy(ProfilePage),
          },
          {
            path: 'security',
            element: renderLazy(SecurityPage),
          },
          {
            path: 'bind-info',
            element: renderLazy(BindInfoPage),
          },
          {
            path: 'donate',
            element: renderLazy(DonatePage),
          },
        ],
      },
      {
        path: '/login',
        element: renderLazy(LoginPage),
      },
      {
        path: '/register',
        element: renderLazy(RegisterPage),
      },
      {
        path: '/forgot-password',
        element: renderLazy(ForgotPasswordPage),
      },
      {
        path: '/change-password',
        element: renderLazy(ChangePasswordPage),
      },
      {
        path: '/reset-password',
        element: renderLazy(ResetPasswordPage),
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