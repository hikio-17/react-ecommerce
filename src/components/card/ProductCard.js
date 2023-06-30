import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import defaultGambar from "../../images/default.png";
import ShowAverage from "../../functions/ShowAverage";
import _, { uniqWith } from "lodash";
import { useSelector, useDispatch } from "react-redux";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  // add to cart
  const [tooltip, setTooltip] = useState("Click to add");

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });

      // remove duplicates
      let unique = uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log("unique", unique);
      localStorage.setItem("cart", JSON.stringify(unique));

      // show Tooltip
      setTooltip("Added");

      // add redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });

      // show cart items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  const { title, description, images, slug, price } = product;

  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        <ShowAverage product={product} />
      ) : (
        <div className="text-center pt-1 pb-3r">No rating yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[0].url : defaultGambar}
            style={{ height: "150px", objectFit: "contain" }}
            className="p-1"
            alt=""
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-info" /> <br /> View Product
          </Link>,

          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart} disabled={product.quantity < 1}>
              <ShoppingCartOutlined className="text-danger" /> <br />{" "}
              {product.quantity < 1 ? "Out of stock" : "Add to Cart"}
            </a>
            ,
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - ${price.toLocaleString("in-ID", {
            style: "currency",
            currency: "IDR",
          })}`}
          description={`${description && description.substring(0, 60)}...`}
        />
      </Card>
    </>
  );
};
export default ProductCard;
