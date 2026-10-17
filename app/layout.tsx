import * as React from "react";
import { Suspense } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import createCache from "@emotion/cache";
import theme from "./theme";
import { CacheProvider } from "@emotion/react";
import AuthProvider from "@/lib/providers/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import { ToastifyContainer } from "@/lib/helpers/Toastify.helper";
import LoginDialogProvider from "@/lib/providers/LoginDialogProvider";
import PreReleaseAuthDialog from "@/components/PreReleaseAuthDialog";
import CartDialogProvider from "@/lib/providers/CartDialogProvider";
import MuiLocalizationProvider from "@/lib/providers/MuiLocalizationProvider";
import DeviceProvider from "@/lib/providers/DeviceProvider";
import TopProgressBar from "@/components/general/TopProgressBar";

export const metadata: Metadata = {
  title: "Robo Rond",
  description: "Best platfrom for buying or selling sim cards",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const dana = localFont({
  src: [
    {
      path: "../public/fonts/dana/dana-thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-extralight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-demibold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-extrabold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/dana/dana-black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

// const cacheRtl = createCache({
//   key: "muirtl",
//   stylisPlugins: [prefixer, rtlPlugin],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body className={`${dana.className}`}>
        <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          {/* <CacheProvider value={cacheRtl}> */}
          <ThemeProvider theme={theme}>
            <MuiLocalizationProvider>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Suspense>
                <TopProgressBar />
              </Suspense>
              <ToastifyContainer />
              <DeviceProvider>
                <LoginDialogProvider>
                  <CartDialogProvider>
                    <AuthProvider>
                      {/* <PreReleaseAuthDialog /> */}
                      {children}
                    </AuthProvider>
                  </CartDialogProvider>
                </LoginDialogProvider>
              </DeviceProvider>
            </MuiLocalizationProvider>
          </ThemeProvider>
          {/* </CacheProvider> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
