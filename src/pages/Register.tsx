import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../firebase';
import { Brush } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterInputs = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInputs>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User successfully signed up with Google
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("Error during Google sign-up redirect:", error);
        if (error.code === 'auth/unauthorized-domain') {
          setError('This domain is not authorized for authentication. Please contact the administrator.');
        } else {
          setError('Failed to sign up with Google. Please try again.');
        }
      });
  }, [navigate]);

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate('/');
    } catch (error: any) {
      console.error("Error during email/password sign-up:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch((error) => {
      console.error("Error initiating Google sign-up:", error);
      if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for authentication. Please contact the administrator.');
      } else {
        setError('Failed to initiate Google sign-up. Please try again.');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-blue-300">Name</label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-blue-300">Email</label>
          <input
            {...register('email')}
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-blue-300">Password</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-blue-300">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            id="confirmPassword"
            type="password"
            className="w-full px-3 py-2 border rounded bg-gray-700 text-white"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
          Register
        </button>
      </form>

      <div className="mt-4">
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 flex items-center justify-center"
        >
          <Brush className="mr-2" />
          Sign up with Google
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <p className="mt-4 text-center text-blue-300">
        Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default Register;