import React from "react";

const Login = ({ goToRegister, authenticate }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    authenticate(); // tells App.jsx the user is logged in
  };

  return (
    <div className="flex bg-white p-6 rounded-2xl shadow-lg w-[900px]">
      
      {/* Left Image */}
      <div className="w-1/2 rounded-3xl overflow-hidden shadow-md">
        <img
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304"
          alt="Room"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Form */}
      <div className="w-1/2 pl-10 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold">Log In</h2>

        <form className="w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-700">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="example@gmail.com"
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="********"
            />
          </div>

          <button className="text-sm text-gray-600 underline mb-4">
            Forgot Password?
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-[#7cae92] text-white rounded-lg text-lg hover:bg-[#6a9c83]"
          >
            Log In
          </button>

          <div className="my-4 text-center text-gray-400 text-sm">
            or log in with
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white flex justify-center items-center gap-3 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5"
              alt="Google"
            />
            Google
          </button>

          <p className="text-gray-600 mt-6 text-sm text-center">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={goToRegister}
              className="text-blue-600 underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
