'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoLogout() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  
  const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 30 minutes in milliseconds
  const WARNING_TIME = 1.5 * 60 * 1000; // 28 minutes - show warning 2 mins before logout

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const resetTimers = () => {
      // Clear existing timers
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setCountdown(120);

      // Set warning timer (28 minutes)
      warningTimer = setTimeout(() => {
        setShowWarning(true);
        
        // Start countdown
        let timeLeft = 120;
        countdownInterval = setInterval(() => {
          timeLeft -= 1;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
          }
        }, 1000);
      }, WARNING_TIME);

      // Set logout timer (30 minutes)
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    const handleActivity = () => {
      resetTimers();
    };

    const handleLogout = async () => {
      try {
        await fetch('/api/customer/logout', { method: 'POST' });
        router.push('/customer/login?timeout=true');
      } catch (error) {
        console.error('Logout error:', error);
        router.push('/customer/login');
      }
    };

    // Activity events to track
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize timers
    resetTimers();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  if (!showWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border-2 border-orange-500/50 rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto w-16 h-16 bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold mb-2">Still there?</h3>
          <p className="text-gray-400 mb-6">
            You've been inactive for a while. For your security, you'll be automatically logged out in:
          </p>

          {/* Countdown */}
          <div className="text-5xl font-bold text-orange-400 mb-6">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                await fetch('/api/customer/logout', { method: 'POST' });
                router.push('/customer/login');
              }}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-semibold transition-colors"
            >
              Logout Now
            </button>
            <button
              onClick={() => {
                setShowWarning(false);
                setCountdown(120);
                // Timers will reset automatically via activity detection
              }}
              className="flex-1 px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors"
            >
              Stay Logged In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}