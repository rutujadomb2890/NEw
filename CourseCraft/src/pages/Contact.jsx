import React from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <>

    <Navbar/>


    <div className="p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        Contact Us
      </h1>

      <form className="space-y-6">

        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          rows="5"
          placeholder="Your Message"
          className="w-full border p-3 rounded-lg"
        ></textarea>

        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg">
          Send Message
        </button>

      </form>

    </div></>
  );
};

export default Contact;