import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { XCircleIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  // here we destructure the cartItems from the state object. This syntax creates const cartItems.
  const {
    cart: { cartItems },
  } = state;

  const removeFromCartHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const updateCartHandler = (item, qty) => {
    // we need this bc qty, as received from the <select> element, is a string.
    const quantity = Number(qty);

    // this spread syntax allows us to update the quantity prop in the item object.
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Shopping Cart</h1>

      {/* Conditional rendering, if the cart is empty display this: */}
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go shopping.</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-5 text-left">Item</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.slug} className="border-b">
                    <td className="py-4">
                      <Link href={`/products/${item.slug}`}>
                        <a className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={75}
                            height={100}
                          ></Image>{" "}
                          {item.name}
                        </a>
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                      >
                        {/* here we are creating an array of [0, ..., n] from the number in item.countInStock, and then mapping over that array to create an <option> element for the full amount in stock. */}
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => removeFromCartHandler(item)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-5">
            <ul>
              <li>
                <div className="pb-3 text-lg">
                  {/* the first reduce method gives us the total amount of items in the cart. */}
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}) : $
                  {/* the second reduce method gives us the total price, by multiplying the quantity of each item by the item price, (we use Number() because the prices is stored as a string.) 
                  
                  we wrap it in ().toFixed(2) in order to display the .00 if the price is an int. Note that this changes the typeof from number to string*/}
                  {cartItems
                    .reduce((a, c) => a + c.quantity * Number(c.price), 0)
                    .toFixed(2)}
                </div>
              </li>
              <li>
                {/* The checkout button will bring us to the shipping page. router.push("/<page> is ") */}
                <button
                  className="primary-button w-full"
                  onClick={() => router.push("login?redirect=/shipping")}
                >
                  Checkout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
