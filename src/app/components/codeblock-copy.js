"use client";

import { useState } from "react";
import { FiClipboard } from "react-icons/fi";

/**
 * A React component that renders a button to copy the provided code block to the clipboard.
 *
 * @param {Object} props - The component props.
 * @param {string} props.children - The code block content to be copied.
 * @returns {JSX.Element} - The rendered button component.
 */
export function CodeBlockCopy({ children }) {
  const [copied, setCopied] = useState(false);

  /**
   * Handles the copy action by writing the code block content to the clipboard
   * and updating the copied state.
   */
  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 bg-gray-700 text-white p-1 rounded-md hover:bg-gray-600 focus:outline-none"
    >
      {copied ? "Copied" : <FiClipboard />}
    </button>
  );
}
