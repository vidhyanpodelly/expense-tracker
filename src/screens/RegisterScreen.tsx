import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ErrorBanner } from '../components/ErrorBanner';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export const RegisterScreen = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await register({ name, email, password });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-8 text-center text-3xl font-bold leading-9 tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Start managing your expenses today
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ErrorBanner message={error} />
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="h-5 w-5" />}
            placeholder="John Doe"
            required
          />

          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign up
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
