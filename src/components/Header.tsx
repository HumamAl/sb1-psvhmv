import React from 'react';
import { Link } from 'react-router-dom';
import { Brush } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Brush size={24} className="text-blue-400" />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">CleanQuote</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/quote">Get Quote</NavLink>
            <NavLink to="/history">Quote History</NavLink>
            <NavLink to="/login">Login</NavLink>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:text-blue-400 transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </Link>
  </li>
);

export default Header;