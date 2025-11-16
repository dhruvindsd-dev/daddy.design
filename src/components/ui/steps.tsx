import React from "react";

interface Props {
  children: React.ReactNode;
}

export const Step = ({ children }: Props) => {
  return (
    <div className="step">
      <h3 className="font-semibold tracking-tight">{children}</h3>
    </div>
  );
};

export function Steps({ children }: Props) {
  return <div className="steps">{children}</div>;
}

export function StepContent({ children }: Props) {
  return (
    <div className="group relative pb-10 last:pb-0">
      <div className="step-line group-last:hidden" />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
