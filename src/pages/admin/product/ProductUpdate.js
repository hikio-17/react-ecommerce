import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { getProduct, updateProduct } from "./../../../functions/product";
import { getCategories, getCategorySubs } from "./../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  subs: [],
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
  color: "",
  brand: "",
};

const ProductUpdate = ({ match, history }) => {
  // state
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  // router
  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () =>
    getProduct(slug)
      .then((p) => {
        // console.log("single product ==>", p);
        // 1.load single product
        setValues({ ...values, ...p.data });
        // 2. load single product category subs
        getCategorySubs(p.data.category._id).then((res) => {
          setSubOptions(res.data);
        });
        // 3. prepare array of sub ._id to show as default select antd
        let arr = [];
        p.data.subs.map((s) => {
          arr.push(s._id);
        });
        // console.log("ARRAY OF SUBS", arr);
        setArrayOfSubs((prev) => arr);
      })
      .catch((err) => console.log(err));

  const loadCategories = () =>
    getCategories().then((c) => {
      setCategories(c.data);
      // console.log(c.data);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.subs = arrayOfSubs;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        // console.log(res);
        toast.success(`"${res.data.title}" is updated`);
        history.push("/admin/products");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    //
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [] });

    setSelectedCategory(e.target.value);

    getCategorySubs(e.target.value).then((res) => {
      // console.log("SUB RESPONSE", res);
      setSubOptions(res.data);
    });

    // if user clicks back to the original category
    // show its sub categories in defualt
    if (values.category._id === e.target.value) {
      loadProduct();
    }

    // clear old sub category ids
    setArrayOfSubs([]);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {/* {JSON.stringify(values)} */}
          {loading ? (
            <LoadingOutlined className="text-danger h1 pb-2 text-center" />
          ) : (
            <h4 className="pb-2 text-center">Product Update</h4>
          )}
          <hr />

          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
