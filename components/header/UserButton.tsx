"use client";

import { AuthContext } from "@/lib/providers/AuthProvider";
import React, { useContext } from "react";
import LoginModal from "../login/LoginModal";
import AccountMenu from "./AccountMenu";

export default function UserButton() {
  const { auth } = useContext(AuthContext);

  return auth.token ? <AccountMenu auth={auth} /> : <LoginModal />;
}
