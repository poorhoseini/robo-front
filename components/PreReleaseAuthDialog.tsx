"use client";

import { useEffect, useState } from "react";

export default function PreReleaseAuthDialog() {
  const [isSecure, setIsSecure] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storageSecurityItem = localStorage.getItem("hamed");
    if (storageSecurityItem === "erfan") setIsSecure(true);
  }, []);

  return isSecure ? (
    <></>
  ) : (
    <div className="absolute z-50 flex h-[10000px] w-full flex-col items-center justify-start gap-4 bg-white p-10">
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Your CIA Password"
      />
      <button
        onClick={() => {
          localStorage.setItem("hamed", password);
        }}
      >
        apply
      </button>
    </div>
  );
}
