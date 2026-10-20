"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "../entities/auth";
import {
  getAuthFromStorage,
  removeAuthFromStorage,
  setAuthIntoStorage,
} from "../helpers/localStorage.helper";

export const initialAuth: Auth = {
  _id: "",
  detail: {},
  name: "",
  phoneNumber: "",
  token: "",
  userId: "",
};

export const AuthContext = createContext({
  auth: initialAuth,
  setAuth: (auth: Auth) => {},
  setAuthAndRedirect: (auth: Auth, redirect?: string) => {},
  resetAuth: () => {},
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<Auth>(initialAuth);
  const router = useRouter();

  useEffect(() => {
    const localStorageAuth: Auth | null = getAuthFromStorage();
    if (localStorageAuth) {
      setAuth(localStorageAuth);
    }
  }, []);

  const setAuthAndRedirect = useCallback(
    (auth: Auth, redirect?: string) => {
      setAuth(auth);
      setAuthIntoStorage(auth);
      router.push(redirect || "/dashboard");
    },
    [router],
  );

  const resetAuth = useCallback(() => {
    setAuth(initialAuth);
    removeAuthFromStorage();
    // router.replace("/");
  }, []);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, setAuthAndRedirect, resetAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
