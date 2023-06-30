import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../functions/product";
import AdminProductCard from "../../../components/card/AdminProductCard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log("Load all products err ==>", err);
      });
  };

  const handleRemove = (slug) => {
    if (window.confirm("delete?")) {
      removeProduct(slug, user.token)
        .then((res) => {
          loadAllProducts();
          toast.error(`${res.data.title} is deleted`);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) toast.error(err.response.data);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col">
          {loading ? (
            <h4 className="text-danger pb-2 text-center">Loading...</h4>
          ) : (
            <h4 className="pb-2 text-center">All Products</h4>
          )}
          <hr />
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4 pb-3" key={product._id}>
                <AdminProductCard
                  product={product}
                  handleRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
