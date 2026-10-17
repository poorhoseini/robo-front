"use client";

import { Auth } from "../entities/auth";
import { Device } from "../entities/device";

export function getAuthFromStorage(): Auth | null {
  const key = process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH as string;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const localStorageAuth = JSON.parse(data) as Auth;
      if (localStorageAuth) return localStorageAuth;
    } catch {
      localStorage.removeItem(key);
    }
  }
  return null;
}

export function setAuthIntoStorage(auth: Auth) {
  localStorage.setItem(
    process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH as string,
    JSON.stringify(auth),
  );
}

export function removeAuthFromStorage() {
  localStorage.removeItem(process.env.NEXT_PUBLIC_LOCAL_STORAGE_AUTH as string);
}

export function getDeviceFromStorage(): Device | null {
  const key = process.env.NEXT_PUBLIC_LOCAL_STORAGE_DEVICE as string;
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const localStorageDevice = JSON.parse(data) as Device;
      if (localStorageDevice) return localStorageDevice;
    } catch {
      localStorage.removeItem(key);
    }
  }
  return null;
}

export function setDeviceIntoStorage(device: Device) {
  localStorage.setItem(
    process.env.NEXT_PUBLIC_LOCAL_STORAGE_DEVICE as string,
    JSON.stringify(device),
  );
}

export function removeDeviceFromStorage() {
  localStorage.removeItem(
    process.env.NEXT_PUBLIC_LOCAL_STORAGE_DEVICE as string,
  );
}
