"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import type { WishlistItem } from "@/lib/api/wishlist";
import { useUser } from "./UserContext";

interface WishlistContextType {
  items: WishlistItem[];
  isWishlisted: (beanId: string) => boolean;
  toggleWishlist: (beanId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [items, setItems] = useState<WishlistItem[]>([]);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const data = await getWishlist();
      setItems(data);
    } catch {
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial + user-change wishlist fetch
    refreshWishlist();
  }, [refreshWishlist]);

  function isWishlisted(beanId: string) {
    return items.some((i) => i.bean._id === beanId);
  }

  async function toggleWishlist(beanId: string) {
    if (isWishlisted(beanId)) {
      await removeFromWishlist(beanId);
    } else {
      await addToWishlist(beanId);
    }
    await refreshWishlist();
  }

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggleWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
