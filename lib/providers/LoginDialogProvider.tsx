"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

export const LoginDialogContext = createContext<{
  loginDialogOpen: boolean;
  setLoginDialogOpen: Dispatch<SetStateAction<boolean>>;
}>({
  loginDialogOpen: false,
  setLoginDialogOpen: (value) => {},
});

export default function LoginDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);

  return (
    <LoginDialogContext.Provider
      value={{ loginDialogOpen, setLoginDialogOpen }}
    >
      {children}
    </LoginDialogContext.Provider>
  );
}
