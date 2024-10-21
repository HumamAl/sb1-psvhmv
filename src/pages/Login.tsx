import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../firebase';
import { Brush } from 'lucide-react';

// ... (keep the existing code)

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User successfully signed in with Google
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("Error during Google sign-in redirect:", error);
        if (error.code === 'auth/unauthorized-domain') {
          setError('This domain is not authorized for authentication. Please contact the administrator.');
        } else {
          setError('Failed to sign in with Google. Please try again.');
        }
      });
  }, [navigate]);

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (error: any) {
      console.error("Error during email/password sign-in:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch((error) => {
      console.error("Error initiating Google sign-in:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for authentication. Please contact the administrator.');
      } else {
        setError('Failed to initiate Google sign-in. Please try again.');
      }
    });
  };

  // ... (keep the rest of the component code)
};

export default Login;