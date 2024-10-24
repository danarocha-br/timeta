import React from "react";

type TimerButtonProps = {
  isPaused: boolean;
  isRest: boolean;
  isTimeOff: boolean;
  onClick: () => void;
  countdown: number;
  totalTime: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const TimerButton: React.FC<TimerButtonProps> = ({
  isPaused,
  isTimeOff,
  countdown,
  totalTime,
  isRest,
  ...props
}) => {
  const radius = 52;
  const strokeWidth = 2;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const safeCountdown = Math.max(countdown, 0);

  // Calculate the stroke dash offset
  // This will be 0 when countdown is at totalTime, and circumference when countdown is 0
  const strokeDashoffset = !isRest ? circumference * (1 - safeCountdown / totalTime) : 0;

  const handleStatusColor = () => {
    if (isTimeOff) {
      return "stroke-warning transition-all";
    } else if (isPaused) {
      return "stroke-accent/20 transition-all";
    } else if (isRest) {
      return "stroke-transparent transition-all";
    } else {
      return "stroke-success transition-all";
    }
  };

  return (
    <button
      {...props}
      className="group relative mr-1 bg-card ring-8 ring-ring w-28 h-28 rounded-full flex items-center justify-center hover:scale-[1.02] hover:ring-accent/30 focus-visible:ring-accent/40 focus-visible:outline-none transition-all"
    >
      <svg
        className="absolute -top-1 left-1 w-full h-full -rotate-90 transition-all"
        width={radius * 2}
        height={radius * 2}
      >
        <circle
          className={handleStatusColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {isPaused ? (
        <svg
          width="27"
          height="32"
          viewBox="0 0 27 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 scale-[0.85] fill-card-foreground group-hover:fill-primary transition-all z-10"
        >
          <path d="M24.1541 11.8404L8.52149 1.463C7.78439 0.973464 6.92751 0.692502 6.04244 0.650147C5.15737 0.607792 4.27737 0.805634 3.4965 1.22253C2.71562 1.63942 2.06323 2.2597 1.60905 3.01706C1.15486 3.77443 0.915952 4.64041 0.917858 5.52245V26.2724C0.917726 27.1536 1.15792 28.0183 1.61282 28.7743C2.06772 29.5303 2.72026 30.1491 3.50081 30.5649C4.28137 30.9806 5.16066 31.1776 6.04488 31.1348C6.9291 31.0921 7.78508 30.8112 8.52149 30.3221L24.1541 19.9447C24.8238 19.5002 25.3729 18.898 25.7527 18.1915C26.1325 17.4851 26.3312 16.6962 26.3312 15.895C26.3312 15.0937 26.1325 14.3049 25.7527 13.5984C25.3729 12.892 24.8238 12.2898 24.1541 11.8453V11.8404Z" />
        </svg>
      ) : (
        <svg
          width="21"
          height="17"
          viewBox="0 0 21 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="scale-[1.3] fill-card-foreground group-hover:fill-primary transition-all z-10"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.00005 0.983521C2.11148 0.983521 1.60093 1.70827 1.36998 2.20867C1.10591 2.78082 0.983521 3.48524 0.983521 4.16672V12.8334C0.983521 13.5149 1.10591 14.2193 1.36998 14.7914C1.60093 15.2918 2.11148 16.0166 3.00005 16.0166H7.00005C7.88863 16.0166 8.39918 15.2918 8.63013 14.7914C8.8942 14.2193 9.01659 13.5149 9.01659 12.8334V4.16672C9.01659 3.48524 8.8942 2.78082 8.63013 2.20867C8.39918 1.70827 7.88863 0.983521 7.00005 0.983521H3.00005ZM3.21592 3.06064C3.22336 3.04452 3.23056 3.02986 3.23743 3.01659H6.76268C6.76955 3.02986 6.77675 3.04452 6.78419 3.06064C6.8952 3.30116 6.98352 3.69893 6.98352 4.16672V12.8334C6.98352 13.3012 6.8952 13.699 6.78419 13.9395C6.77675 13.9556 6.76955 13.9703 6.76268 13.9835H3.23743C3.23056 13.9703 3.22336 13.9556 3.21592 13.9395C3.10491 13.699 3.01659 13.3012 3.01659 12.8334V4.16672C3.01659 3.69893 3.10491 3.30116 3.21592 3.06064Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.0001 0.983521C13.1115 0.983521 12.6009 1.70827 12.37 2.20867C12.1059 2.78082 11.9835 3.48524 11.9835 4.16672V12.8334C11.9835 13.5149 12.1059 14.2193 12.37 14.7914C12.6009 15.2918 13.1115 16.0166 14.0001 16.0166H18.0001C18.8886 16.0166 19.3992 15.2918 19.6301 14.7914C19.8942 14.2193 20.0166 13.5149 20.0166 12.8334V4.16672C20.0166 3.48524 19.8942 2.78082 19.6301 2.20867C19.3992 1.70827 18.8886 0.983521 18.0001 0.983521H14.0001ZM14.2159 3.06064C14.2234 3.04452 14.2306 3.02986 14.2374 3.01659H17.7627C17.7695 3.02986 17.7767 3.04452 17.7842 3.06064C17.8952 3.30116 17.9835 3.69893 17.9835 4.16672V12.8334C17.9835 13.3012 17.8952 13.699 17.7842 13.9395C17.7767 13.9556 17.7695 13.9703 17.7627 13.9835H14.2374C14.2306 13.9703 14.2234 13.9556 14.2159 13.9395C14.1049 13.699 14.0166 13.3012 14.0166 12.8334V4.16672C14.0166 3.69893 14.1049 3.30116 14.2159 3.06064Z"
          />
        </svg>
      )}
    </button>
  );
};
