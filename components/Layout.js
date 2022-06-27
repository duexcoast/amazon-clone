import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Layout({ title, children }) {
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
                <a className="p-2">Cart</a>
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
