import React from "react";

const CategoryForm = ({ handleSubmit, setName, name }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          className="form-control"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <br />
        <button className="btn btn-outline-primary">Save</button>
      </div>
    </form>
  );
};

export default CategoryForm;
