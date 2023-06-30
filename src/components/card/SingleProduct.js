import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import defaultGambar from "../../images/default.png";
import ProductListItems from "./ProductListItems";
import StartRating from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import ShowAverage from "./../../functions/ShowAverage";
import _, { uniqWith } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStartClick, star }) => {
  // add to cart
  const [tooltip, setTooltip] = useState("Click to add");

  // redux
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  // router
  const history = useHistory();

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

  const { title, description, images, _id } = product;

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      console.log("ADD TO WISHLIST", res.data);
      toast.success("Added to wishlist");
      history.push("/user/whislist");
    });
  };
  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((i) => (
                <img
                  src={i.url}
                  key={i.public_id}
                  style={{ objectFit: "contain" }}
                />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img src={defaultGambar} className="mb-3 card-image" />}
          ></Card>
        )}

        <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call use on +62 822-3788-8697 learn more about this product
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h5 className="bg-info p-3">{title}</h5>

        {product && product.ratings && product.ratings.length > 0 ? (
          <ShowAverage product={product} />
        ) : (
          <div className="text-center pt-1 pb-3r">No rating yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" /> <br /> Add to
                Cart
              </a>
              ,
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" /> <br /> Add to Wishlist
            </a>,
            <RatingModal>
              <StartRating
                name={_id}
                numberOfStars={5}
                changeRating={onStartClick}
                rating={star}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
