"use client";

import { createContext, useEffect, useState } from "react";
import {
  removeDeviceFromStorage,
  setDeviceIntoStorage,
} from "../helpers/localStorage.helper";
import { Device } from "../entities/device";
import { useMediaQuery, useTheme } from "@mui/material";

export const initialDevice: Device = {
  isMobile: true,
};

export const DeviceContext = createContext({
  device: initialDevice,
  handleChangeDeviceAction: (device: Device) => {},
  handleResetDeviceAction: () => {},
});

export default function DeviceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const fullScreen = !useMediaQuery(theme.breakpoints.up("md"));
  const [device, setDevice] = useState<Device>({ isMobile: fullScreen });

  useEffect(() => {
    setDevice({ isMobile: fullScreen });
  }, [fullScreen]);

  // useEffect(() => {
  //   const localStorageDevice: Device | null = getDeviceFromStorage();
  //   if (localStorageDevice) {
  //     setDevice(localStorageDevice);
  //   }
  // }, []);

  const handleChangeDeviceAction = (device: Device) => {
    setDevice(device);
    setDeviceIntoStorage(device);
  };

  const handleResetDeviceAction = () => {
    setDevice(initialDevice);
    removeDeviceFromStorage();
  };

  return (
    <DeviceContext.Provider
      value={{
        device,
        handleChangeDeviceAction,
        handleResetDeviceAction,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}
