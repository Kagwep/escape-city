import React from "react";
import { Link } from "react-router-dom";


interface PropTypes {
  product: string;
}

export const RunAwayItem: React.FC<PropTypes> = ({ product }) => {
  return (
    <div className="card shadow-xl">
      <figure>
        <Link to={''}>
          <img src={''} alt={''} />
        </Link>
      </figure>
      <div className="card-body p-4">
        <Link to={''}>
          <h2 className="card-title text-sm truncate"></h2>
        </Link>
        <div className="flex justify-between w-full">
          <small className="opacity-70">Price: </small>
          <small></small>
        </div>
        <div className="card-actions">
          <Link to={''} className="w-full">
            <button className="btn btn-primary btn-sm w-full">Buy Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

