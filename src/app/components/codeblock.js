// components/CodeBlock.js
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock ({ className, children }) {
  const language = className?.replace('language-', '') || 'javascript';
  return (
    <p className="my-4">
        <SyntaxHighlighter language={language} style={solarizedlight}>
        {children}
        </SyntaxHighlighter>
    </p>
  );

// export function CodeBlock ({ props }) {
//   const language = props.className?.replace('language-', '') || 'javascript';
//   return (
//     <div className="my-4">
//         <SyntaxHighlighter language={language} style={solarizedlight}>
//         {props.children}
//         </SyntaxHighlighter>
//     </div>
//   );
};
