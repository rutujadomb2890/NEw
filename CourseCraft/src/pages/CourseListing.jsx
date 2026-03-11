import { Link } from "react-router-dom";

const CourseListing = () => {
  const courses = [
    { id: 1, title: "React for Beginners", instructor: "John Doe" },
    { id: 2, title: "Advanced JavaScript", instructor: "Jane Smith" },
    { id: 3, title: "Full Stack Development", instructor: "David Lee" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">All Courses</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-500 mt-2">
              Instructor: {course.instructor}
            </p>

            <Link
              to={`/course-details/${course.id}`}
              className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListing;
