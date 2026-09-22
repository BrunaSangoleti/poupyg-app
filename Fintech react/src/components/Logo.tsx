import React from 'react';
import logoImage from '../assets/Gemini_Generated_Image_2yamgd2yamgd2yam-removebg-preview.png';

interface LogoProps {
    size?: string; 
}

export const Logo: React.FC<LogoProps> = ({ size = '60px' }) => (
    <div className="flex items-center justify-center p-2 hover:-translate-y-0.5 transition-transform duration-200">
        <img
            src={logoImage}
            alt="Logo Pupyg"
            className="object-contain"
            style={{ width: size, height: 'auto' }}
        />
    </div>
);