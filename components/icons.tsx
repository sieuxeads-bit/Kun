import React from 'react';

const iconProps = {
  className: "w-5 h-5 mr-2",
  strokeWidth: "1.5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor"
};

export const FileIcon = () => (
  <svg {...iconProps}>
    <path d="M14 3v4a1 1 0 001 1h4"></path>
    <path d="M17 21h-10a2 2 0 01-2-2v-14a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"></path>
  </svg>
);

export const WandIcon = () => (
  <svg {...iconProps}>
    <path d="M12.5 21H8.5a4.5 4.5 0 0 1-4.5-4.5V8.5A4.5 4.5 0 0 1 8.5 4h7a4.5 4.5 0 0 1 4.5 4.5v1"></path>
    <path d="m18 14 4 4-2 2-4-4-2 2-4-4 2-2 4 4 2-2z"></path>
  </svg>
);

export const LanguageIcon = () => (
  <svg {...iconProps}>
    <path d="M4 5h7"></path>
    <path d="M9 3v2c0 4.418-2.239 8-5 8"></path>
    <path d="M5 9c-.003 2.144 2.952 3.908 6.7 4"></path>
    <path d="M12 20l4-9l4 9"></path>
    <path d="M19.1 18h-6.2"></path>
  </svg>
);

export const UsersIcon = () => (
  <svg {...iconProps}>
    <path d="M9 7c0-2.21 2.24-4 5-4s5 1.79 5 4-2.24 4-5 4-5-1.79-5-4z"></path>
    <path d="M2 22a8.99 8.99 0 0110-8.82"></path>
    <path d="M14.2 22a2.99 2.99 0 003.8-.4l2.6-2.6a3 3 0 000-4.2l-2.6-2.6a3 3 0 00-4.2 0l-.4.4"></path>
  </svg>
);

export const DownloadIcon = () => (
  <svg {...iconProps}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export const SaveIcon = () => (
    <svg {...iconProps}>
        <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

export const SpinnerIcon = () => (
    <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);