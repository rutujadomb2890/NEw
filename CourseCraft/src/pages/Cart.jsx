import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CartContext } from "../context/CartContext";
import { enrollCourse } from "../api/courseApi";

const Cart = () => {
    
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getOriginalTotal,
    getTotalDiscount,
    clearCart,
  } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState([]);
  const [taxRate] = useState(0.1); // 10% tax
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const subtotal = getCartTotal();
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  const originalTotal = getOriginalTotal();
  const discount = getTotalDiscount();
  const discountPercentage =
    originalTotal > 0 ? ((discount / originalTotal) * 100).toFixed(2) : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");
    setAlreadyEnrolled([]);

    try {
      console.log("Starting checkout for user:", user._id);
      console.log("Enrolling in courses:", cart.map(c => ({ id: c._id, title: c.title })));

      // Enroll user in courses - handle partial failures
      const enrollmentPromises = cart.map((course) =>
        enrollCourse(user._id, course._id)
          .then((res) => {
            console.log("Successfully enrolled in:", course.title, "Response:", res.data);
            return {
              courseId: course._id,
              success: true,
              title: course.title,
            };
          })
          .catch((err) => {
            console.error("Failed to enroll in:", course.title, "Error:", err.response?.data || err.message);
            return {
              courseId: course._id,
              success: false,
              title: course.title,
              error: err.response?.data?.message || "Failed to enroll",
            };
          })
      );

      const results = await Promise.all(enrollmentPromises);
      console.log("Enrollment results:", results);

      // Check for already enrolled courses
      const failedEnrollments = results.filter((r) => !r.success);
      const alreadyEnrolledCourses = failedEnrollments.filter(
        (r) => r.error === "Already enrolled"
      );

      if (alreadyEnrolledCourses.length > 0) {
        setAlreadyEnrolled(alreadyEnrolledCourses);
        // Remove already enrolled courses from cart
        alreadyEnrolledCourses.forEach((course) => {
          removeFromCart(course.courseId);
        });
      }

      const successfulEnrollments = results.filter((r) => r.success);
      const otherFailures = failedEnrollments.filter(
        (r) => r.error !== "Already enrolled"
      );

      console.log("Successful enrollments:", successfulEnrollments.length);
      console.log("Failed enrollments:", otherFailures.length);

      if (otherFailures.length > 0) {
        setError(
          `Failed to enroll in ${otherFailures.length} course(s): ${otherFailures.map((r) => r.title).join(", ")}`
        );
      }

      // Handle successful enrollments
      if (successfulEnrollments.length > 0) {
        // Clear cart after successful enrollments
        clearCart();
        
        // Show success message
        const message = failedEnrollments.length > 0
          ? `Successfully enrolled in ${successfulEnrollments.length} course(s)! Some courses failed.`
          : `Successfully enrolled in ${successfulEnrollments.length} course(s)!`;
        
        alert(message);
        
        console.log("Clearing cart and navigating to /my-courses after 1200ms delay...");
        
        // Add a larger delay to ensure backend data is committed and indexes are updated
        setTimeout(() => {
          console.log("Navigating to /my-courses");
          navigate("/my-courses", { replace: true });
        }, 1200);
      } else if (failedEnrollments.length > 0 && alreadyEnrolledCourses.length > 0) {
        // Only already enrolled courses, no actual failures
        setError("All courses were already in your enrollment list!");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("Failed to complete checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="p-10 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-lg p-10 text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start by adding some courses to your cart
            </p>
            <button
              onClick={() => navigate("/allcourses")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {alreadyEnrolled.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
                  <strong>Note:</strong> The following courses have been removed
                  from your cart as you are already enrolled:{" "}
                  {alreadyEnrolled.map((c) => c.title).join(", ")}
                </div>
              )}

              {cart.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-4 border-b pb-6 mb-6 last:border-b-0"
                >
                  <img
                    src={
                      course.thumbnail
                        ? `http://localhost:5000${course.thumbnail}`
                        : "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={course.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      by {course.instructor?.name || "Unknown"}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-indigo-600 font-bold">
                        ${course.discountPrice || course.price}
                      </span>
                      {course.discountPrice && (
                        <span className="line-through text-gray-400">
                          ${course.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          course._id,
                          (course.quantity || 1) - 1
                        )
                      }
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    >
                      −
                    </button>
                    <span className="font-semibold w-8 text-center">
                      {course.quantity || 1}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          course._id,
                          (course.quantity || 1) + 1
                        )
                      }
                      className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(course._id)}
                    className="text-red-500 hover:text-red-700 font-semibold ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountPercentage}%)</span>
                    <span className="font-semibold">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You're saving $
                  {discount.toFixed(2)} ({discountPercentage}%) with current
                  discounts!
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold mb-3 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Checkout & Enroll"}
              </button>

              <button
                onClick={() => navigate("/allcourses")}
                className="w-full border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
