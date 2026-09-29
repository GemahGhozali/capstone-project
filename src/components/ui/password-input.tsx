"use client";

import { createContext, useContext, useState } from "react";

interface PasswordContextType {
  showPassword: boolean;
  toggleShowPassword: () => void;
  inputType: "text" | "password";
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export function usePassword() {
  const context = useContext(PasswordContext);

  if (!context) {
    throw new Error("Component harus berada di dalam komponen PasswordInput");
  }

  return context;
}

interface PasswordInputProps {
  render: (inputType: "text" | "password", showPassword: boolean) => React.ReactNode;
}

export function PasswordInput({ render }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = showPassword ? "text" : "password";

  return (
    <PasswordContext.Provider value={{ showPassword, toggleShowPassword, inputType }}>{render(inputType, showPassword)}</PasswordContext.Provider>
  );
}

interface PasswordTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PasswordTrigger({ children, onClick, ...props }: PasswordTriggerProps) {
  const { toggleShowPassword } = usePassword();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    toggleShowPassword();
    if (onClick) onClick(e);
  };

  return (
    <div onClick={handleClick} {...props}>
      {children}
    </div>
  );
}
