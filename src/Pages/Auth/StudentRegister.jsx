import React from "react";
import { Link } from "react-router-dom";

const StudentRegister = () => {
  return (
    <div className="min-h-screen flex items-center p-20 box-border flex-col">
      <h1 className="text-4xl">NO REGISTRATION FOR NEW STUDENTS ONGOING!!!</h1>
      <h3 className="text-red-600 text-4xl">Beware of scammers!</h3>
      <Link to="/" className="mt-10">
        Back to homepage
      </Link>
    </div>
  );
};

export default StudentRegister;
