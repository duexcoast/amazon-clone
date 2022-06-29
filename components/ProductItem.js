/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React, { useContext } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function ProductItem({ product }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const addToCartHandler = () => {
    // check if the item is already in the cart using .find() to check for matching slug properties. returns the item object.
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);

    // if the item is already in the cart, then set the quantity of the item to + 1. Otherwise, the quantity is 1.
    const quantity = existItem ? existItem.quantity + 1 : 1;

    // if the amount in stock is less than the quantity, then alert the user and return from the function.
    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock.");
      return;
    }

    // Otherwise, dispatch the updated context, spreading the product object so we can update the quantity property.
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    // We use router.push() here because there's no link to press, we are programatically navigating to a new page. router.push() is client-side navigation and not SEO friendly. it does not create anchor tags.
    router.push("/cart");
  };

  return (
    <div className="card">
      <Link href={`/products/${product.slug}`}>
        <a>
          <img
            src={product.image}
            alt={product.name}
            className="rounded shadow h-4/6 w-full object-cover"
          />
        </a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/products/${product.slug}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
