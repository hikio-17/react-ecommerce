import React from "react";
import StarRating from "react-star-ratings";

const ShowAverage = ({ product }) => {
  if (product && product.ratings) {
    let ratingsArray = product && product.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((r) => total.push(r.star));
    let totalReduced = total.reduce((p, n) => p + n, 0);
    // console.log("totalReduced =>", totalReduced);

    let highest = length * 5;
    // console.log("highest", highest);

    let result = (totalReduced * 5) / highest;
    // console.log("result", result);

    return (
      <div className="text-center pt-1 pb-3">
        <span>
          <StarRating
            starDimension="20px"
            startSpacing="2px"
            starRatedColor="red"
            rating={result}
            editing={false}
          />{" "}
          ({product.ratings.length})
        </span>
      </div>
    );
  }
};

export default ShowAverage;
