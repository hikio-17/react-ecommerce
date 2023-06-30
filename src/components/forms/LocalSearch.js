import React from "react";

const LocalSearch = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };
  return (
    <input
      type="search"
      className="form-control mb-4"
      value={keyword}
      onChange={handleSearchChange}
      placeholder="Filter"
    />
  );
};

export default LocalSearch;
