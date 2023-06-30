import React from "react";
import { Card } from "antd";
import defaultGambar from "../../images/default.png";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, description, images, slug } = product;
  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : defaultGambar}
          style={{ height: "150px", objectFit: "contain" }}
          className="p-1"
          alt=""
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-info" />
        </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleRemove(slug)}
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 60)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
