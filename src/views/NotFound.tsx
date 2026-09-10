import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-primary">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mt-2">
            Sorry, the page you are looking for does not exist.
          </p>
          <Button asLink to="/" className="mt-8">
            Go Back Home
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
