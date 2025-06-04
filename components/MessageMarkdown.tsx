import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function MessageMarkdown({
  content,
  isUser,
}: {
  content: string;
  isUser: boolean;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors no-underline hover:underline"
          >
            {children}
          </a>
        ),
        p: ({ children }) => (
          <p
            className={`text-[#4A5E6D] text-sm leading-relaxed ${
              isUser ? "" : "my-3"
            } whitespace-pre-wrap`}
          >
            {children}
          </p>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-[#323F49] mb-3 border-b pb-2">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-[#323F49] my-3">
            {children}
          </h2>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-3 text-[#4A5E6D] text-sm space-y-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-3 text-[#4A5E6D] text-sm space-y-2">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-[#4A5E6D] bg-gray-50 py-2 rounded">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-[#323F49]">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-gray-100 rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono text-[#323F49] border border-gray-200">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-[#323F49] uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 text-sm text-[#4A5E6D] border-t border-gray-200">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
