
"use client";

import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
};

function calculateTimeLeft(targetDate: string): TimeLeft {
  const target = new Date(targetDate).getTime();

  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  const distance = target - Date.now();

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
  }

  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance % 86400000) / 3600000),
    minutes: Math.floor((distance % 3600000) / 60000),
    seconds: Math.floor((distance % 60000) / 1000),
    isEnded: false,
  };
}

export function ElectionCountdown({
  targetDate,
  theme = "light",
}: {
  targetDate: string;
  theme?: "light" | "dark";
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isEnded: false,
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    const updateCountdown = () => {
      const newTime = calculateTimeLeft(targetDate);
      setTimeLeft(newTime);

      if (newTime.isEnded && interval) {
        clearInterval(interval);
        interval = undefined;
      }
    };

    updateCountdown();

    interval = setInterval(updateCountdown, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [targetDate]);

  const isDark = theme === "dark";

  const circleTheme = isDark
    ? "bg-[#0B1930] border border-white/20"
    : "bg-white border border-[#E5E7EB]";

  const numClass = isDark ? "text-white" : "text-[#0B1930]";
  const labelClass = isDark ? "text-gray-400" : "text-[#667085]";

  const ringBase =
    "absolute inset-0 rounded-full border-[1.5px] sm:border-[2px] border-transparent animate-[spin_4s_linear_infinite]";

  const ringTheme =
    "border-t-[#2563EB] border-r-[#2563EB]/30";

  if (timeLeft.isEnded) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center px-4">
        <p className="text-base sm:text-lg font-semibold text-[#0B1930]">
          Voting has officially ended.
        </p>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Waiting for administrator to verify and publish results.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center items-center gap-1.5 sm:gap-3 md:gap-5 w-full max-w-md mx-auto px-1 sm:px-0">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Mins" },
        { value: timeLeft.seconds, label: "Secs" },
      ].map((item) => (
        <div
          key={item.label}
          className={`flex-1 min-w-0 aspect-square relative flex flex-col items-center justify-center rounded-full shadow-sm z-10 ${circleTheme}`}
        >
          <div className={`${ringBase} ${ringTheme}`} />
          <span
            className={`text-sm sm:text-2xl md:text-4xl font-bold ${numClass} relative z-10 leading-none mb-0.5`}
          >
            {item.value}
          </span>
          <span
            className={`text-[7px] sm:text-[10px] md:text-xs font-medium ${labelClass} uppercase tracking-wider relative z-10`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
