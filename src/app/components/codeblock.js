"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { FiClipboard } from "react-icons/fi";

export function CodeBlock({ className, children }) {
  const language = className?.replace("language-", "") || "javascript";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-800 rounded-lg">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 bg-gray-700 text-white p-1 rounded-md hover:bg-gray-600 focus:outline-none"
      >
        {copied ? "Copied" : <FiClipboard />}
      </button>
      <SyntaxHighlighter language={language} style={solarizedlight}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
