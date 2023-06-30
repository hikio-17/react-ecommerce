import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { getCategories } from "../../../functions/category";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";
import { createSub, removeSub, getSubs } from "./../../../functions/sub";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);

  // step filtering
  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubs = () => getSubs().then((s) => setSubs(s.data));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createSub({ name, parent: category }, user.token)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setName("");
        toast.success(`${res.data.name} is Created!`);
        loadSubs();
      })
      .catch((err) => {
        // console.log(err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = (slug) => {
    setLoading(true);
    if (window.confirm("delete ?")) {
      removeSub(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} is deleted!`);
          loadSubs();
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.status === "400") toast.error(err.response.data);
        });
    }
  };

  // step 4
  const searched = (keyword) => (s) => s.name.toLowerCase().includes(keyword);

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
            <h4 className="pb-2 text-center">Create sub category</h4>
          )}

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
          {/** step 2 & step 3 */}
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {/** step 5 */}
          {subs.filter(searched(keyword)).map((s) => (
            <div className="alert alert-secondary" key={s._id}>
              {s.name}{" "}
              <span
                className="btn btn-sm float-right"
                onClick={() => handleRemove(s.slug)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/sub/${s.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-info" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
