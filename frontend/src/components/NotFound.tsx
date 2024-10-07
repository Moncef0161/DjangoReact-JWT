import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto mt-8 p-4 text-center">
      <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-xl mb-4">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link to="/">Go back to home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
