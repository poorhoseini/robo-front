"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

export const CartDialogContext = createContext<{
  cartDialogOpen: boolean;
  subscriptionCartDialogOpen: boolean;
  setCartDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSubscriptionCartDialogOpen: Dispatch<SetStateAction<boolean>>;
}>({
  cartDialogOpen: false,
  subscriptionCartDialogOpen: false,
  setCartDialogOpen: (value) => {},
  setSubscriptionCartDialogOpen: (value) => {},
});

export default function CartDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartDialogOpen, setCartDialogOpen] = useState<boolean>(false);
  const [subscriptionCartDialogOpen, setSubscriptionCartDialogOpen] =
    useState<boolean>(false);

  return (
    <CartDialogContext.Provider
      value={{
        cartDialogOpen,
        setCartDialogOpen,
        subscriptionCartDialogOpen,
        setSubscriptionCartDialogOpen,
      }}
    >
      {children}
    </CartDialogContext.Provider>
  );
}
