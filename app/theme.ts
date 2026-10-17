"use client";
// import { Roboto } from 'next/font/google';
import { createTheme } from "@mui/material/styles";
import { faIR as coreFaIr } from "@mui/material/locale";
import { faIR } from "@mui/x-date-pickers/locales";
import type {} from "@mui/x-date-pickers/themeAugmentation";

// const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

const theme = createTheme(
  {
    direction: "rtl",
    palette: {
      mode: "light",
      primary: {
        main: "#404040",
        light: "#535353",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 545,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    //   typography: {
    //     fontFamily: roboto.style.fontFamily,
    //   },
    components: {
      MuiPopover: {
        styleOverrides: {
          root: {
            "& .MuiMenuItem-root": {
              fontFamily: "unset",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiFormLabel-root": {
              left: "unset",
              right: 28,
              top: 0,
              transformOrigin: "right",
              fontFamily: "unset",
            },
            "& fieldset": {
              textAlign: "right",
            },
            "& .MuiInputBase-root": {
              borderRadius: 8,
              fontFamily: "unset",
              backgroundColor: "white",
              "&.Mui-disabled": {
                backgroundColor: "#f2f2f2",
              },
              "& .MuiInputAdornment-root": {
                p: {
                  fontFamily: "unset",
                  color: "#8c8c8c",
                },
              },
            },
            "& .Mui-disabled": {
              WebkitTextFillColor: "#404040 !important",
            },
            "& .Mui-error": {
              color: "#EE384E",
              fieldset: {
                borderColor: "#EE384E !important",
              },
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          // root: ({ ownerState }) => {
          //   console.log(ownerState);
          //   return {};
          // },
          icon: {
            right: "unset",
            left: "7px",
          },
          select: {
            paddingRight: "14px!important",
            paddingLeft: "32px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            "&.Mui-selected": {
              backgroundColor: "unset",
              "&:hover": {
                backgroundColor: "#F5F5F5",
              },
              "&:focus-visible": {
                backgroundColor: "#E0E0E0",
              },
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          endAdornment: {
            right: "unset !important",
            left: "7px",
          },
          inputRoot: {
            paddingRight: "14px!important",
            paddingLeft: "32px",
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            height: 26,
            width: 46,
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: 2,
              left: "unset",
              right: -1,
              top: -1,
              transitionDuration: "300ms",
              "&.Mui-checked": {
                transform: "translateX(-20px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                  backgroundColor: "#535353",
                  opacity: 1,
                  border: 0,
                },
                "&.Mui-disabled + .MuiSwitch-track": {
                  opacity: 0.5,
                },
              },
              "&.Mui-focusVisible .MuiSwitch-thumb": {
                color: "#404040",
                border: "6px solid #fff",
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: "B3B3B3",
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.7,
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 24,
              height: 24,
            },
            "& .MuiSwitch-track": {
              borderRadius: 26 / 2,
              backgroundColor: "#B3B3B3",
              opacity: 1,
              height: 26,
              width: 46,
              // transition: theme.transitions.create(["background-color"], {
              //   duration: 500,
              // }),
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            gap: "8px",
            borderRadius: "6px",
            fontFamily: "inherit",
            "& .MuiButton-icon": { marginRight: 0, marginLeft: 0 },
          },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          rounded: {
            borderRadius: "8px",
          },
          root: {
            backgroundColor: "#ECECEC",
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            // backgroundColor: "red",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: "unset",
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            fontFamily: "unset",
            color: "#404040 !important",
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            span: { fontFamily: "unset", color: "#404040" },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            ...(ownerState.severity === "info" && {
              backgroundColor: "#60a5fa",
            }),
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: { tooltip: { fontFamily: "inherit" } },
      },
    },
  },
  faIR,
  coreFaIr,
);

export default theme;
