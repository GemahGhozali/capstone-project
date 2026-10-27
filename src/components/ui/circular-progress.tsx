"use client";

import "react-circular-progressbar/dist/styles.css";

import { cn } from "cn";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

interface CircularProgressProps {
  max: number;
  value: number;
  label?: string;
  className?: string;
}

export function CircularProgress({ max, value, label, className = "" }: CircularProgressProps) {
  return (
    <div className={cn("relative", className)}>
      <CircularProgressbar
        maxValue={max}
        value={value}
        styles={buildStyles({
          pathColor: "var(--sidebar-primary)",
          trailColor: "var(--border)",
        })}
        counterClockwise={true}
        strokeWidth={10}
      />
      <div className="space-y-0.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <p className="text-2xl leading-7 font-semibold text-center">
          {value}
          <span className="text-sm">/{max}</span>
        </p>
        <p className="text-center text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
