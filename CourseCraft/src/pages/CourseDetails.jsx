import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Course Details (ID: {id})
        </h1>

        <p className="text-gray-600 mb-4">
          This is a detailed description of the course.
        </p>

        <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
