"use client";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HighestBidMenu() {
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
        <p>بالاترین پیشنهاد</p>
        <Image
          src="/icons/icon-chevron-down-white.svg"
          alt="SimCard"
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
            href="/search?searchType=simcard&isHighestBid=true"
            className="w-full text-white"
          >
            سیم کارت
          </Link>
        </MenuItem>
        <MenuItem sx={{ padding: "16px" }} onClick={handleMenuItemClick}>
          <Link
            href="/search?searchType=simPack&isHighestBid=true"
            className="w-full text-white"
          >
            سیم پک
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
}
