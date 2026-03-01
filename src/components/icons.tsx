import React from "react";

export const Icons = {
  ChatGPT: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#74AA9C" />
      <path
        d="M16.5 10.5C16.5 8.5 15 7 13 7C11.5 7 10.2 7.8 9.5 9C8.8 8.5 7.8 8.5 7 9C6 9.5 5.5 10.5 5.5 11.5C5.5 12.5 6 13.5 7 14C7.5 14.5 8.2 14.8 9 14.8C9.5 16 10.5 17 12 17C13.5 17 14.8 16.2 15.5 15C16.2 15.5 17.2 15.5 18 15C19 14.5 19.5 13.5 19.5 12.5C19.5 11.5 19 10.5 18 10C17.5 9.5 16.8 9.2 16 9.2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Starburst: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#E67E5A" />
      <path
        d="M12 6V18M6 12H18M7.5 7.5L16.5 16.5M7.5 16.5L16.5 7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  BlackStar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#111" />
      <path
        d="M12 6L13.5 10.5H18L14.5 13.5L15.5 18L12 15L8.5 18L9.5 13.5L6 10.5H10.5L12 6Z"
        fill="white"
      />
    </svg>
  ),
  GreenLightning: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#10B981" />
      <path d="M13 6L7 13H12L11 18L17 11H12L13 6Z" fill="white" />
    </svg>
  ),
  Vercel: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#111" />
      <path d="M12 6L18 16H6L12 6Z" fill="white" />
    </svg>
  ),
  D: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#111" />
      <path
        d="M9 7H13C15.5 7 17 8.5 17 11C17 13.5 15.5 15 13 15H9V7ZM11 9V13H13C14.5 13 15 12.5 15 11C15 9.5 14.5 9 13 9H11Z"
        fill="white"
      />
    </svg>
  ),
  K: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#111" />
      <path
        d="M9 7V17M9 12L14 7M9 12L15 17"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Stripe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#4F46E5" />
      <path
        d="M6 16L18 8M6 12L18 4M6 20L18 12"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  ),
  Figma: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#111" />
      <path
        d="M9 7C9 5.89543 9.89543 5 11 5H13C14.1046 5 15 5.89543 15 7C15 8.10457 14.1046 9 13 9H11C9.89543 9 9 8.10457 9 7Z"
        fill="#F24E1E"
      />
      <path
        d="M9 11C9 9.89543 9.89543 9 11 9H13C14.1046 9 15 9.89543 15 11C15 12.1046 14.1046 13 13 13H11C9.89543 13 9 12.1046 9 11Z"
        fill="#A259FF"
      />
      <path
        d="M9 15C9 13.8954 9.89543 13 11 13H13C14.1046 13 15 13.8954 15 15C15 16.1046 14.1046 17 13 17H11C9.89543 17 9 16.1046 9 15Z"
        fill="#1ABCFE"
      />
      <path
        d="M9 11C9 12.1046 8.10457 13 7 13C5.89543 13 5 12.1046 5 11C5 9.89543 5.89543 9 7 9C8.10457 9 9 9.89543 9 11Z"
        fill="#0ACF83"
      />
      <path
        d="M9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7Z"
        fill="#FF7262"
      />
    </svg>
  ),
  Cube: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#111" />
      <path
        d="M12 6L17 9V15L12 18L7 15V9L12 6Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 18V12M12 12L7 9M12 12L17 9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};
