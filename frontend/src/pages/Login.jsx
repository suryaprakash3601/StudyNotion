import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../assets/Images/login.webp";
import frame from "../assets/Images/frame.png";
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authApi";


export default function Login() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const[formData,setFormData]=useState({
    email:"",
    password:""
  })
  const{email,password}=formData;

  const handleChange=(e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.name]:e.target.value
    }))
  }

  const handleSubmit=(e)=>{
    e.preventDefault();

    dispatch(login(email,password,navigate))
  }
  
  



  return (
    <div className="bg-richblack-900 min-h-screen w-full flex flex-col-reverse lg:flex-row justify-between items-center px-6 md:px-12 lg:px-24 py-12 gap-y-12">
      <div className="w-full lg:w-[50%] max-w-[500px] text-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-2 ">Welcome Back</h2>
        <p className="text-pure-greys-200 mb-6  text-lg">
          Build skills for today, tomorrow, and beyond. <br />
          <span className="font-edu-sa font-bold italic text-blue-100">
            Education to future-proof your career.
          </span>
        </p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-pure-greys-100 font-medium">
              Email Address <span className="text-pink-300">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full p-3 rounded bg-richblack-700 text-white placeholder:text-pure-greys-300 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-pure-greys-100 font-medium"
            >
              Password <span className="text-pink-300">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full p-3 rounded bg-richblack-700 text-white placeholder:text-pure-greys-300 focus:outline-none"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-100 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 hover:scale-105 transition-all duration-200"
          >
            Sign In
          </button>
          {/* Submit Button */}
        </form>
        
      </div>
      <div className="hidden lg:flex w-full lg:w-[45%] max-w-[450px] relative aspect-square">
        <img src={frame} alt="" className="absolute left-3 top-3 w-full h-full object-cover" />
        <img src={LoginImg} alt="" className="absolute left-0 top-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}
