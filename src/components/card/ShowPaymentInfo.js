import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => (
  <div className="row offset-md-1 text-left">
    <div className="col-md-6">
      <p>
        <span>Order Id: {order.paymentIntent.id}</span>
        <br />
        <span>Amount: {order.paymentIntent.amount}</span>
        <br />
        <span>Currency: {order.paymentIntent.currency.toUpperCase()}</span>
        <br />
      </p>
    </div>

    <div className="col-md-6">
      <p>
        <span>Method: {order.paymentIntent.payment_method_types[0]}</span>
        <br />
        <span>Payment: {order.paymentIntent.status.toUpperCase()}</span>
        <br />
        <span>
          Ordered on:{" "}
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </span>
        <br />
        {showStatus && (
          <span className="badge bg-primary text-white">
            STATUS: {order.orderStatus}
          </span>
        )}
      </p>
    </div>
  </div>
);

export default ShowPaymentInfo;
