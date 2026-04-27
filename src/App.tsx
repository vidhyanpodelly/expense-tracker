import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';

import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ExpensesScreen } from './screens/ExpensesScreen';
import { AddEditExpenseScreen } from './screens/AddEditExpenseScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { MainLayout } from './components/MainLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const MobileWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-zinc-950 items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-[400px] h-[850px] max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-2xl ring-8 ring-zinc-900">
        {/* Notch simulation */}
        <div className="absolute left-1/2 top-0 z-50 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-zinc-900"></div>
        <div className="h-full w-full pt-8">{children}</div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Flow */}
        <Route path="/login" element={<AuthRoute><LoginScreen /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterScreen /></AuthRoute>} />

        {/* Main App Flow */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ExpenseProvider>
                <MainLayout />
              </ExpenseProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardScreen />} />
          <Route path="expenses" element={<ExpensesScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
        </Route>
        
        {/* Full Screen Modals/Stacks */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <ExpenseProvider>
                <AddEditExpenseScreen />
              </ExpenseProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <ExpenseProvider>
                <AddEditExpenseScreen />
              </ExpenseProvider>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MobileWrapper>
        <AppRoutes />
      </MobileWrapper>
    </AuthProvider>
  );
}
