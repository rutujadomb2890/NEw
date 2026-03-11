import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Navbar from "../components/Navbar";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {

  // 🔥 Popular Courses (Slider Data)
  const courses = [
    {
      id: 1,
      title: "Complete React Bootcamp",
      instructor: "John Doe",
      price: 49,
      rating: 4.5,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee"
    },
    {
      id: 2,
      title: "Node.js Mastery",
      instructor: "Jane Smith",
      price: 39,
      rating: 4.7,
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c"
    },
    {
      id: 3,
      title: "MongoDB Complete Guide",
      instructor: "David Lee",
      price: 29,
      rating: 4.4,
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    },
    {
      id: 4,
      title: "Advanced JavaScript",
      instructor: "Emily Clark",
      price: 59,
      rating: 4.8,
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
      id: 5,
      title: "Python for Beginners",
      instructor: "Sophia Wilson",
      price: 25,
      rating: 4.3,
      thumbnail: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72"
    }
  ];

  // 🎯 Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50">

        {/* HERO SECTION */}
        <section className="bg-indigo-600 text-white text-center py-20 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Learn Skills That Shape Your Future
          </h1>
          <p className="text-lg mb-8">
            High-quality courses from industry experts.
          </p>
          <Link
            to="/allcourses"
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold"
          >
            Explore Courses
          </Link>
        </section>


        {/* 🔥 POPULAR COURSES SLIDER */}
        <section className="py-16 px-10 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12">
            Popular Courses
          </h2>

          <Slider {...sliderSettings}>
            {courses.map(course => (
              <div key={course.id} className="px-4">
                <div className="bg-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">

                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-2">
                      {course.instructor}
                    </p>

                    <p className="text-yellow-500 mb-2">
                      ⭐ {course.rating}
                    </p>

                    <p className="text-indigo-600 font-bold mb-4">
                      ${course.price}
                    </p>

                    <Link
                      to={`/course-player/${course.id}`}
                      className="block text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                      Start Learning
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </section>


        {/* WHY CHOOSE US */}
        <section className="bg-gray-100 py-16 px-10">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from real industry professionals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Lifetime Access
              </h3>
              <p className="text-gray-600">
                Access courses anytime, anywhere.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Practical Projects
              </h3>
              <p className="text-gray-600">
                Build real-world portfolio projects.
              </p>
            </div>

          </div>
        </section>


        {/* CTA */}
        <section className="bg-indigo-600 text-white text-center py-16">
          <h2 className="text-3xl font-bold mb-6">
            Start Learning Today
          </h2>

          <Link
            to="/register"
            className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold"
          >
            Join Now
          </Link>
        </section>

      </div>
    </>
  );
};

export default Home;