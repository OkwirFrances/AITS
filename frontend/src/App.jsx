import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { IssuesProvider } from './context/IssueContext';
import ErrorBoundary from './pages/ErrorBoundary';
import ProtectedRoute from './pages/ProectectedRoute';
import './App.css';

// Simple fallback component instead of LoadingSpinner
const Fallback = () => <div>Loading...</div>;

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('./pages/Home/landingpage'));
const SignUp = React.lazy(() => import('./pages/Auth/signup'));
const SignIn = React.lazy(() => import('./pages/Auth/signin'));
const Otp = React.lazy(() => import('./pages/Auth/otp'));
const Congratulations = React.lazy(() => import('./pages/congratulations'));
const StudentDashboard = React.lazy(() => import('./pages/Dashboard/StudentDashboard'));
const LecturerDashboard = React.lazy(() => import('./pages/Dashboard/LecturerDashboard'));
const RegistrarDashboard = React.lazy(() => import('./pages/Dashboard/RegistrarDashboard'));
const DashboardContent = React.lazy(() => import('./pages/Dashboard/Dashboardcontent'));
const IssueForm = React.lazy(() => import('./pages/Issues/issueform'));
const IssueDetails = React.lazy(() => import('./pages/Issues/issuedetails'));
const NotificationScreen = React.lazy(() => import('./pages/notificationscreen'));
const HelpSupport = React.lazy(() => import('./pages/helpsupport'));
const Settings = React.lazy(() => import('./pages/Profile/settings'));
const DepartmentManagement = React.lazy(() => import('./pages/DepartmentManagement'));
const CourseManagement = React.lazy(() => import('./pages/CourseManagement'));
import LecturerManagement from './pages/LecturerManagement';
const LecturerIssues = React.lazy(() => import('./pages/LecturerIssues'));

const App = () => {
  return (
    <IssuesProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="landing" replace />} />
              <Route path="landing" element={<LandingPage />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="otp" element={<Otp />} />
              <Route path="congratulations" element={<Congratulations />} />

              {/* Protected Student Routes */}
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="issueform" element={<IssueForm />} />
                <Route path="issues" element={<DashboardContent />} />
                <Route path="issue/:id" element={<IssueDetails />} />
                <Route path="notifications" element={<NotificationScreen />} />
                <Route path="support" element={<HelpSupport />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Protected Lecturer Routes */}
              <Route
                path="/lecturer/*"
                element={
                  <ProtectedRoute allowedRoles={['lecturer']}>
                    <LecturerDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="issue/:id" element={<IssueDetails />} />
                <Route path="issues" element={<LecturerIssues />} />
                <Route path="notifications" element={<NotificationScreen />} />
                <Route path="support" element={<HelpSupport />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Protected Registrar Routes */}
              <Route
                path="/registrar/*"
                element={
                  <ProtectedRoute allowedRoles={['registrar']}>
                    <RegistrarDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="issue/:id" element={<IssueDetails />} />
                <Route path="notifications" element={<NotificationScreen />} />
                <Route path="support" element={<HelpSupport />} />
                <Route path="settings" element={<Settings />} />
                <Route path="lecturer" element={<LecturerManagement />} />
                <Route path="departments" element={<DepartmentManagement />} />
                <Route path="courses" element={<CourseManagement />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/landing" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </IssuesProvider>
  );
};

export default App;