import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "../components/card/ProductCardInCheckout";
import { userCart } from "../functions/user";

const Cart = ({ history }) => {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const getTotal = () => {
    return cart.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  // save order to db by card
  const saveOrderToDB = () => {
    // console.log("cart", cart);
    userCart(cart, user.token)
      .then((res) => {
        // console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("CART SAVE ERR", err));
  };

  // save order to db by cash
  const saveCashOrderToDB = () => {
    // console.log("cart", cart);
    dispatch({
      type: "COD",
      payload: true,
    });
    userCart(cart, user.token)
      .then((res) => {
        // console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("CART SAVE ERR", err));
  };

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <th scope="col">Image</th>
        <th scope="col">Title</th>
        <th scope="col">Price</th>
        <th scope="col">Brand</th>
        <th scope="col">Color</th>
        <th scope="col">Count</th>
        <th scope="col">Shipping</th>
        <th scope="col">Remove</th>
      </thead>

      {cart.map((p) => (
        <ProductCardInCheckout key={p._id} product={p} />
      ))}
    </table>
  );

  return (
    <div className="container-fluid pt-3">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Products</h4>

          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop"> Continue Shopping.</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>

        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = Rp {c.count * c.price}
              </p>
            </div>
          ))}
          <hr />
          Total: <b>Rp {getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={saveOrderToDB}
                disabled={!cart.length}
              >
                Proceed to Checkout
              </button>
              <br />
              <button
                className="btn btn-sm btn-warning mt-2"
                onClick={saveCashOrderToDB}
                disabled={!cart.length}
              >
                Pay Cash on Delivery
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link
                to={{
                  pathname: "/login",
                  state: {
                    from: "cart",
                  },
                }}
              >
                Login to Checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
