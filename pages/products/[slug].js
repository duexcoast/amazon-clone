import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import data from "../../utils/data";
import Link from "next/link";
import Image from "next/image";
import { Store } from "../../utils/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  // const { query } = useRouter();
  console.log(router.query);
  const { slug } = router.query;
  const product = data.products.find((x) => x.slug === slug);

  const stock = product.countInStock > 0 ? true : false;

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      alert("Sorry. Product is out of stock.");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    // We use router.push() here because there's no link to press, we are programatically navigating to a new page. router.push() is client-side navigation and not SEO friendly. it does not create anchor tags.
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className='py-2'>
        <Link href='/'>Back to products.</Link>
      </div>
      <div className='grid md:grid-cols-4 md:gap-3'>
        <div className='md:col-span-2'>
          <Image
            src={product.image}
            alt={product.name}
            width={1200}
            height={1600}
            layout='responsive'
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-3xl mb-2'>{product.name}</h1>
            </li>
            <li>{product.brand}</li>
            <li>Category: {product.category}</li>
            <li>
              {product.rating} stars from {product.numReviews} reviews
            </li>
            <li>{product.description}</li>
          </ul>
        </div>
        <div>
          <div className='card p-5'>
            <div className='mb-2 flex justify-between'>
              <div className='font-bold'>Price</div>
              <div>{product.price}</div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div className='font-bold'>Status</div>
              <div>{stock ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className={`${
                stock ? "primary-button" : "inactive-button"
              } w-full`}
              onClick={addToCartHandler}
            >
              {stock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
