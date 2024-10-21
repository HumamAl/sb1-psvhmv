import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brush } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Welcome to CleanQuote
        </h1>
        <p className="text-xl text-blue-200 mb-8">Get accurate quotes for your commercial cleaning needs</p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <Link
          to="/quote"
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-blue-500 rounded-full shadow-md"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-blue-500 group-hover:translate-x-0 ease">
            <Sparkles className="w-6 h-6" />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-blue-500 transition-all duration-300 transform group-hover:translate-x-full ease">Get a Quote</span>
          <span className="relative invisible">Get a Quote</span>
        </Link>
        <Link
          to="/register"
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-purple-500 rounded-full shadow-md"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-purple-500 group-hover:translate-x-0 ease">
            <Brush className="w-6 h-6" />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-purple-500 transition-all duration-300 transform group-hover:translate-x-full ease">Sign Up</span>
          <span className="relative invisible">Sign Up</span>
        </Link>
      </div>
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Why Choose CleanQuote?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <FeatureCard
            title="Instant Quotes"
            description="Get accurate cleaning quotes in seconds, tailored to your specific needs."
          />
          <FeatureCard
            title="Professional Service"
            description="Our network of vetted cleaning professionals ensures top-quality service."
          />
          <FeatureCard
            title="Flexible Scheduling"
            description="Choose from a variety of cleaning frequencies to suit your business needs."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <div className="bg-blue-800 bg-opacity-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-blue-200">{description}</p>
    </div>
  );
};

export default Home;