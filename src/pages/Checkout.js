import React, { useState, useEffect } from "react";
import {
  getUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/user";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { emptyUserCart } from "./../functions/user";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [couponCheck, setCouponCheck] = useState("");

  // price after discount
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user, COD, coupon } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      // console.log(res);
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== "undefinied") {
      localStorage.removeItem("cart");
    }

    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });

    dispatch({
      type: "COUPON_APPLIED",
      payload: true,
    });

    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setCouponCheck("");
      setTotalAfterDiscount(0);
      toast.success("Cart is empty. Continue shopping");
    });
  };

  const saveAddressToDb = () => {
    // console.log("address ->", address);
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  const applyDiscountCoupon = () => {
    console.log("SEND APPLY COUPON TO BACKEND", coupon);
    applyCoupon(couponCheck, user.token).then((res) => {
      console.log("RES ON COUPON APPLIED", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true/false
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }

      if (res.data.err) {
        setDiscountError(res.data.err);
        // update redux coupon applied true/false
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button onClick={saveAddressToDb} className="btn btn-primary mt-2">
        Save
      </button>
    </>
  );

  const showProductSummary = () => {
    return products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {(p.product.price * p.count).toLocaleString("in-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </p>
      </div>
    ));
  };

  const showApplyCoupon = () => (
    <>
      <input
        type="text"
        className="form-control"
        onChange={(e) => {
          setCouponCheck(e.target.value);
          setDiscountError("");
        }}
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, coupon).then((res) => {
      console.log("CASH ORDER CREATED RES", res);
      // empty cart from redux, local storage, reset coupon, reset cod

      // empty cart local storage
      if (typeof window !== undefined) localStorage.removeItem("cart");

      // empty cart from redux
      dispatch({
        type: "ADD_TO_CART",
        payload: [],
      });

      // empty coupon from redux
      dispatch({
        type: "COUPON_APPLIED",
        payload: false,
      });

      // empty COD from redux
      dispatch({
        type: "COD",
        payload: false,
      });

      // empty user cart from backend
      emptyUserCart(user.token);

      // redirect
      setTimeout(() => {
        history.push("/user/history");
      }, 1000);
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <h4>Delivery Address</h4>
          <br />
          <br />
          {showAddress()}
          <hr />
          <h4>Got Coupon ?</h4>
          <br />
          {showApplyCoupon()}
          <br />
          {discountError && <p className="bg-danger p-2">{discountError}</p>}
        </div>

        <div className="col-md-6">
          <h4>Order Summary</h4>
          <hr />
          <p>Products {products.length}</p>
          <hr />

          {showProductSummary()}
          <hr />
          <p>
            Cart Total:{" "}
            {total.toLocaleString("in-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>

          {totalAfterDiscount > 0 && (
            <p className="bg-success p-2 ">
              Discount Applied: Total Payable: Rp {totalAfterDiscount}
            </p>
          )}

          <div className="row">
            <div className="col-md-6">
              {COD ? (
                <button
                  disabled={!addressSaved || !products.length}
                  className="btn btn-primary"
                  onClick={createCashOrder}
                >
                  Place Order
                </button>
              ) : (
                <button
                  disabled={!addressSaved || !products.length}
                  className="btn btn-primary"
                  onClick={() => history.push("/payment")}
                >
                  Place Order
                </button>
              )}
            </div>
            <div className="col-md-6">
              <button
                disabled={!products.length}
                onClick={emptyCart}
                className="btn btn-primary"
              >
                Empty Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
