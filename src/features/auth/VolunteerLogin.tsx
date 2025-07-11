import React, { useState } from 'react';
import { verifyOTP } from '@/utils/ht6-api';
import { useNavigate } from 'react-router';
import Button from '@/components/button';
import AlertPopup from '@/components/alert-popup';

export default function VolunteerLogin() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleVerifyOTP = async () => {
    if (!email.trim() || !code.trim()) {
      showAlertMessage('Please enter both email and OTP code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOTP(code.trim(), email.trim());
      localStorage.setItem('HT6_token', response.message.token);
      localStorage.setItem('HT6_user_role', 'volunteer');
      localStorage.setItem('HT6_volunteer_email', response.message.user.email);
      localStorage.setItem(
        'HT6_volunteer_name',
        `${response.message.user.firstName} ${response.message.user.lastName}`.trim(),
      );
      showAlertMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (error: any) {
      const errorResponse = error?.message || error;
      const status = error?.status || 500;

      if (status === 401) {
        showAlertMessage(
          'Access denied. Please check your OTP code and try again.',
        );
      } else if (status === 400) {
        const errorMessage =
          typeof errorResponse === 'string' ? errorResponse : 'Invalid request';
        if (
          errorMessage.includes('expired') ||
          errorMessage.includes('Expired')
        ) {
          showAlertMessage(
            'OTP code has expired. Please contact an organizer for a new code.',
          );
        } else if (
          errorMessage.includes('used') ||
          errorMessage.includes('Used')
        ) {
          showAlertMessage(
            'OTP code has already been used. Please contact an organizer for a new code.',
          );
        } else if (
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist')
        ) {
          showAlertMessage(
            'OTP code does not exist. Please check your code and try again.',
          );
        } else if (
          errorMessage.includes('email') ||
          errorMessage.includes('Email')
        ) {
          showAlertMessage('Email address does not match the OTP code.');
        } else {
          showAlertMessage(
            'Invalid OTP code or email. Please check your details and try again.',
          );
        }
      } else if (status === 404) {
        showAlertMessage(
          'OTP code not found. Please check your code and try again.',
        );
      } else if (status === 500) {
        showAlertMessage('Server error. Please try again later.');
      } else {
        showAlertMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          Volunteer Login
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white font-mono text-center text-lg"
            />
          </div>

          <Button
            onClick={handleVerifyOTP}
            disabled={isLoading}
            className="w-full py-3 mt-6"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Contact an organizer to receive your OTP code
          </p>
        </div>
      </div>

      {showAlert && <AlertPopup message={alertMessage} />}
    </div>
  );
}
