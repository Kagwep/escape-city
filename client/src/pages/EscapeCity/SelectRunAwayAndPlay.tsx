import React from "react";
import { Link, useLoaderData, useNavigation } from "react-router-dom";
import { RunAwayItem } from "components/Views";

interface PropTypes {}

const RunAways: React.FC<PropTypes> = () => {


  return (
    <>
      {/* breadcrumb */}
      <div className="container mx-auto">
        <div className="text-sm breadcrumbs p-2">
          <ul>
            <li>
              <Link to="/" className="link">
                Home
              </Link>
            </li>
            <li>RunAways</li>
          </ul>
        </div>
      </div>
      <hr className="h-px bg-gray-300 border-0 dark:bg-gray-500 opacity-30" />

      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            {/* product items */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-4 p-2 ">
              <p> run aways here </p>

                {/* {!loading &&
                runaways.map((r) => (
                  <RunAwayItem product={r} key={r.nftInfoId} />
                ))} */}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RunAways;