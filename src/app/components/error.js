"use client"
/**
 * ErrorMessage component
 * 
 * @param {String} props.message
 * @returns {JSX.Element}
 */
export const ErrorMessage = ({ message }) => {
  console.log("error message", message);
  return (
    <div style={{ color: "red", padding: "10px", border: "1px solid red", margin: "10px 0" }}>
      <p>Error: {message}</p>
    </div>
  );
};

export default ErrorMessage;
