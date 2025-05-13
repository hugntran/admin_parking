import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back", to = null, className = "" }) => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.warn("useNavigate must be used within a Router.");
    return null; // Không render gì nếu không nằm trong Router
  }

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition ${className}`}
      aria-label="Go back"
    >
      {label}
    </button>
  );
};

export default BackButton;
