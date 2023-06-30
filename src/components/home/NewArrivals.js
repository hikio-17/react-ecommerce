import React, { useState, useEffect } from "react";
import LoadingCard from "../card/LoadingCard";
import ProductCard from "../card/ProductCard";
import { getProducts, getProductsCount } from "../../functions/product";
import { Pagination } from "antd";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => {
      setProductsCount(res.data);
    });
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // sort, order, limit
    getProducts("createdAt", "desc", page).then((res) => {
      setLoading(false);
      setProducts(res.data);
    });
  };

  const handleChange = (value) => {
    console.log(value);
    setPage(value);
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="container">
            <div className="row">
              {products.map((product) => (
                <div className="col-md-4" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="row">
        <nav className="text-center col-md-4 offset-md-4 pt-2 p-3">
          <Pagination
            current={page}
            total={(productsCount / 3) * 9}
            onChange={handleChange}
          />
        </nav>
      </div>
    </>
  );
};

export default NewArrivals;
