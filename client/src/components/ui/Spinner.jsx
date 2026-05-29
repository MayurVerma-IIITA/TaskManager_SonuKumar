const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4"
};

const Spinner = ({ size = "md", className = "" }) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-blue-200 border-t-blue-600 ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
