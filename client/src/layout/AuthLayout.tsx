import React, { ReactNode } from 'react';
import logo from '../assets/logo.png';

// Define the props type
interface AuthLayoutsProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutsProps> = ({ children }) => {
  return (
    <>
      <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
        <img 
          src={logo}
          alt='logo'
          width={180}
          height={60}
        />
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
