import React, { useState, useEffect } from "react";
import SingleProduct from "../components/card/SingleProduct";
import { getProduct, productStar } from "../functions/product";
import { useSelector } from "react-redux";
import { getRelated } from "./../functions/product";
import ProductCard from "./../components/card/ProductCard";

const Product = ({ match }) => {
  const [product, setProduct] = useState([]);
  const [star, setStar] = useState(0);
  const { user } = useSelector((state) => ({ ...state }));
  const [related, setRelated] = useState([]);

  const { slug } = match.params;

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObejct = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );

      existingRatingObejct && setStar(existingRatingObejct.star);
    }
  }, []);

  const loadSingleProduct = () =>
    getProduct(slug).then((res) => {
      setProduct(res.data);
      // load related
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });

  const onStartClick = (newRating, name) => {
    // console.table(newRating, name);
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      console.log("Rating updated =>", res.data);
      loadSingleProduct();
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStartClick={onStartClick}
          star={star}
        />
      </div>

      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4 className="alert ant-alert-info">Related product</h4>
          <hr />
        </div>
      </div>

      <div className="row pb-5">
        {related.length
          ? related.map((r) => (
              <div key={r._id} className="col-md-4">
                <ProductCard product={r} />
              </div>
            ))
          : "No product found"}
      </div>
    </div>
  );
};

export default Product;
