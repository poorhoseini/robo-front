"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { useContext, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { Auth } from "@/lib/entities/auth";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "../general/Spinner";
import endCurrentUserSession from "@/lib/api/endCurrentUserSession";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { IconButton, useMediaQuery, useTheme } from "@mui/material";

export default function AccountMenu({ auth }: { auth: Auth }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const open = Boolean(anchorEl);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const handleLogout = async () => {
    setLoadingLogout(true);

    try {
      const res = await endCurrentUserSession(auth.token);
      resetAuth();
      handleClose();
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در بستن نشست");
      }
    } finally {
      setLoadingLogout(false);
      if (pathname.includes("/dashboard")) {
        router.push("/");
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {fullScreen ? (
        <IconButton onClick={handleClick}>
          <Image
            src="/icons/icon-avatar-black.svg"
            alt=""
            width={24}
            height={24}
          />
        </IconButton>
      ) : (
        <button onClick={handleClick} className="h-12 w-12">
          <Image
            src="/icons/icon-avatar.svg"
            alt="Avatar"
            width={48}
            height={48}
          />
        </button>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: { width: "312px", borderRadius: "12px" },
          },
        }}
        sx={{ "& ul": { padding: 0 } }}
      >
        {/* <MenuItem sx={{ padding: "16px" }}>
          <div className="flex w-full flex-row items-start justify-start gap-2">
            <Image
              src="/icons/icon-user.svg"
              alt="Login"
              width={24}
              height={24}
            />
            <div className="flex flex-col items-start justify-between gap-2">
              <p className="text-sm font-medium text-grey">
                {auth.name === "Undefined" ? "کاربر روبورند" : auth.name}
              </p>
              <p className="text-xs font-normal text-grey">
                {persianNumber(auth.phoneNumber)}
              </p>
            </div>
          </div>
        </MenuItem>
        <HorizontalLine />
        <MenuItem sx={{ padding: "16px" }} onClick={handleClose}>
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <Image
              src="/icons/icon-user.svg"
              alt="Login"
              width={24}
              height={24}
            />
            <p className="text-sm font-normal text-grey">پیام ها</p>
          </div>
        </MenuItem>
        <HorizontalLine /> */}
        <MenuItem
          sx={{ padding: "16px" }}
          onClick={() => {
            router.push("/dashboard/settings/my-account");
            handleClose();
          }}
        >
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <Image
              src="/icons/icon-user.svg"
              alt="Login"
              width={24}
              height={24}
            />
            <p className="text-sm font-normal text-grey">ویرایش پروفایل</p>
          </div>
        </MenuItem>
        <HorizontalLine />
        <MenuItem
          sx={{ padding: "16px" }}
          onClick={() => {
            router.push("/dashboard");
            handleClose();
          }}
        >
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <Image
              src="/icons/icon-squares.svg"
              alt="Dashboard"
              width={24}
              height={24}
            />
            <p className="text-sm font-normal text-grey">داشبورد مدیریت</p>
          </div>
        </MenuItem>
        <HorizontalLine />
        <MenuItem
          sx={{ padding: "16px" }}
          onClick={handleLogout}
          disabled={loadingLogout}
        >
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <Image
              src="/icons/icon-logout.svg"
              alt="Logout"
              width={24}
              height={24}
            />
            <p className="text-sm font-normal text-grey">خروج</p>
            {loadingLogout && <Spinner />}
          </div>
        </MenuItem>
      </Menu>
    </>
  );
}

function HorizontalLine() {
  return (
    <div className="ml-auto mr-auto h-[1px] w-[90%] border-b border-grey-100" />
  );
}
