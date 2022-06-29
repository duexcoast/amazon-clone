import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Store } from "../utils/Store";

export default function Layout({ title, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // useEffect hook to setCartItemsCount, this fixes hydration errors caused by the difference between cartItemsCount on the server (which is zero on refresh), and the cartItems on the client-side which are saved in a cookie. By using the useState and useEffect hooks, the initial cartItemsCount will be 0 (matching the server-side count), and it will then update to what we have in the context Store (which is stored locally with a cookie). 
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);
  return (
    <>
      <Head>
        <title>{title ? title + " - duex coast" : "duex coast"}</title>
        <meta name="description" content="E-Commerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between shadow-sm items-center px-4">
            <Link href="/">
              <a className="text-lg font-bold">duex coast</a>
            </Link>
            <div className="">
              <Link href="/cart">
                <a className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                      {/* Shows the current quantity of all items in the cart. */}
                      {cartItemsCount}
                    </span>
                  )}
                </a>
              </Link>
              <Link href="/login">
                <a className="p-2">Login</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          Copyright © 2022 duex coast
        </footer>
      </div>
    </>
  );
}
