import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  createCoupon,
  removeCoupon,
} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import AdminNav from "../../../components/nav/AdminNav";
import { DeleteOutlined } from "@ant-design/icons";

const CreateCouponPage = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  const loadAllCoupons = () => getCoupons().then((res) => setCoupons(res.data));

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, discount, expiry }, user.token)
      .then((res) => {
        setLoading(false);
        loadAllCoupons();
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`${res.data.name} is created`);
      })
      .catch((err) => {
        setLoading(false);
        console.log("CREATE COUPON ERROR", err);
      });
  };

  const handleRemove = (couponId) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          setLoading(false);
          loadAllCoupons();
          toast.error(`Coupon "${res.data.name}" is deleted`);
        })
        .catch((err) => console.log("DELETE COUPON IS ERROR", err));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                value={discount}
                required
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <DatePicker
                className="form-control"
                selected={new Date()}
                value={expiry}
                required
                onChange={(date) => setExpiry(date)}
              />
            </div>

            <button className="btn btn-outline-primary">Save</button>
          </form>

          <br />

          <table className="table table-bordered">
            <thead className="thead-light">
              <th>Name</th>
              <th>Expiry</th>
              <th>Discount</th>
              <th>Action</th>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount} %</td>
                  <td>
                    <DeleteOutlined
                      className="text-danger pointer"
                      onClick={() => handleRemove(c._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCouponPage;
