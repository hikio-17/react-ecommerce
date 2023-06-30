import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "./../components/card/ProductCard";
import { Slider, Menu, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { getCategories } from "./../functions/category";
import Star from "../components/forms/Star";
import { getSubs } from "./../functions/sub";

const { SubMenu } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState();
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  const dispatch = useDispatch();

  useEffect(() => {
    loadAllProducts();
    // fetch categories
    getCategories().then((res) => setCategories(res.data));
    // fetch sub category
    getSubs().then((res) => setSubs(res.data));
  }, []);

  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  // 1. load products by default on page load
  const loadAllProducts = () => {
    getProductsByCount(12).then((p) => {
      setProducts(p.data);
      setLoading(false);
    });
  };

  // 2. load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({ query: text });
      if (!text) {
        loadAllProducts();
      }
    }, 300);
    return () => clearTimeout(delayed);
  }, [text]);

  // 3. load products based on price range
  useEffect(() => {
    // console.log("ok to request!");
    fetchProducts({ price });
  }, [ok]);

  const handleSlider = (value) => {
    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCategoryIds([]);
    setPrice(value);
    setStar("");
    setSub("");
    setColor("");
    setShipping("");
    setBrand("");
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  // 4. load products based on category
  // show categories in a list of checkbox
  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoryIds.includes(c._id)}
        >
          {c.name}
        </Checkbox>
      </div>
    ));

  // handleCheck for categories
  const handleCheck = (e) => {
    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setStar("");
    setSub("");
    setColor("");
    setBrand("");
    setShipping("");

    // console.log(e.target.value);
    const inTheState = [...categoryIds];
    const justCheked = e.target.value;
    const foundInTheState = inTheState.indexOf(justCheked); // return index if true else -1

    // indexOf method ?? if not found returns -1 else return index [0,1,2,3]
    if (foundInTheState === -1) {
      inTheState.push(justCheked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }

    setCategoryIds(inTheState);
    // console.log(inTheState);

    fetchProducts({ category: inTheState });
  };

  // 5. show products by star rating
  const handleStarClick = (num) => {
    // console.log(num);

    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setSub("");
    setColor("");
    setBrand("");
    setShipping("");
    setStar(num);

    fetchProducts({ stars: num });
  };
  const showStars = () => (
    <div className="pb-2 pl-4 pr-4">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  // 6. show products by sub category
  const showSub = () =>
    subs.map((s) => (
      <div
        key={s._id}
        onClick={() => handleSub(s)}
        className="p-1 m-1 badge badge-secondary"
        style={{ cursor: "pointer" }}
      >
        {s.name}
      </div>
    ));

  const handleSub = (sub) => {
    // console.log("SUB", sub);
    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setBrand("");
    setCategoryIds([]);
    setStar("");
    setShipping("");
    setColor("");

    fetchProducts({ sub });
  };
  // 7. show products based on brand name
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        key={b}
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pl-4 pr-4 pb-1 "
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    // console.log(e.target.value);
    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setShipping("");
    setColor("");
    setBrand(e.target.value);
    fetchProducts({ brand: e.target.value });
  };

  // 8. show products based on colors
  const showColors = () =>
    colors.map((c) => (
      <Radio
        key={c}
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pl-4 pr-4 pb-1 "
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    // console.log(e.target.value);
    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setShipping("");
    setColor(e.target.value);
    fetchProducts({ color: e.target.value });
  };

  // 9. show products based on shipping yes/no
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingChange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingChange = (e) => {
    // reset state
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 0]);
    setCategoryIds([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    fetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 pt-2">
          <h4>Search/filters</h4>
          <hr />

          <Menu
            mode="inline"
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
          >
            {/** Price */}
            <SubMenu
              key="1"
              title={
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="ml-4 mr-4"
                  tipFormatter={(v) => `Rp${v}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="99999999"
                />
              </div>
            </SubMenu>

            {/**Category */}
            <SubMenu
              key="2"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Category
                </span>
              }
            >
              <div>{showCategories()}</div>
            </SubMenu>

            {/**Ratings/stars */}
            <SubMenu
              key="3"
              title={
                <span className="h6">
                  <StarOutlined />
                  Rating
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>

            {/**Sub Category */}
            <SubMenu
              key="4"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Sub Categories
                </span>
              }
            >
              <div className="pl-4 pr-4">{showSub()}</div>
            </SubMenu>

            {/**Brands */}
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Brands
                </span>
              }
            >
              <div className="pr-5">{showBrands()}</div>
            </SubMenu>

            {/**Colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Colors
                </span>
              }
            >
              <div className="pr-5">{showColors()}</div>
            </SubMenu>

            {/** Shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Shipping
                </span>
              }
            >
              <div className="pr-5">{showShipping()}</div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}

          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
