"use client"
/**
 * Message component
 * 
 * @param {String} props.message
 * @returns {JSX.Element}
 */
export const Message = ({ message }) => {
  return (
    <div style={{ color: "green", padding: "10px", border: "1px solid green", margin: "10px 0" }}>
      <p>Message: {message}</p>
    </div>
  );
};

export default Message;
