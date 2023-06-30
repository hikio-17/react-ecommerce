import React, { useState } from "react";
import { toast } from "react-toastify";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";

const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(password);
    setLoading(true);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(false);
        toast.success("Password updated successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log("PASSWORD UPDATED", err);
        toast.error(err.message);
      });
  };

  const updatePasswordForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Your password</label>
        <input
          type="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          disabled={loading}
          value={password}
        />
        <button
          className="btn btn-primary"
          disabled={!password || password.length < 6 || loading}
        >
          Submit
        </button>
      </div>
    </form>
  );
  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger pb text-center">Loading...</h4>
          ) : (
            <h4 className="pb-2 text-center">Password Update</h4>
          )}
          {updatePasswordForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
