import React from "react";

interface Props {
  children: React.ReactNode;
}

const ComponentWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex h-[70vh] w-screen items-center justify-center sm:h-screen">
      {children}
    </div>
  );
};
export default ComponentWrapper;
