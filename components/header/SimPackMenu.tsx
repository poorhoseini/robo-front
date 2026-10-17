"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SimPackMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = () => {
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="flex flex-row items-center gap-1"
      >
        <p>سیم پک</p>
        <Image
          src="/icons/icon-chevron-down-white.svg"
          alt="SimPack"
          width={24}
          height={24}
        />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            sx: {
              width: "120px",
              borderRadius: "0px 0px 4px 4px",
              backgroundColor: "#535353",
            },
          },
        }}
        sx={{ "& ul": { padding: 0 } }}
      >
        <MenuItem
          sx={{ padding: "16px 16px 8px 16px" }}
          onClick={handleMenuItemClick}
        >
          <Link
            href="/search?searchType=simPack&simPackType=hamzad"
            className="w-full text-white"
          >
            همزادی
          </Link>
        </MenuItem>
        <MenuItem
          sx={{ padding: "16px 16px 8px 16px" }}
          onClick={handleMenuItemClick}
        >
          <Link
            href="/search?searchType=simPack&simPackType=sabad"
            className="w-full text-white"
          >
            سبدی
          </Link>
        </MenuItem>
        <MenuItem sx={{ padding: "16px" }} onClick={handleMenuItemClick}>
          <Link
            href="/search?searchType=simPack&simPackType=serial"
            className="w-full text-white"
          >
            سریالی
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
}
