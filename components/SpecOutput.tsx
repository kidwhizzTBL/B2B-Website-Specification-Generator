
import React, { useState, useMemo } from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface SpecOutputProps {
  spec: string;
}

// This is a simple markdown parser. For a real app, a library like 'marked' would be better.
const parseMarkdown = (text: string) => {
    // A more robust regex could be used here
    let html = text
        .replace(/^##\s+(.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
        .replace(/^###\s+(.*$)/gim, '<h3 class="text-lg font-semibold mt-3 mb-1">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-sm rounded px-1 py-0.5">$1</code>')
        .replace(/\n/g, '<br />');

    // Group list items
    html = html.replace(/(<li.*<\/li>)(?!(<br \/>){0,2}<li)/g, '$1</ul>')
               .replace(/(<br \/>){0,2}(<li.*<\/li>)/g, '<ul>$2');
    
    // Cleanup extra breaks around lists and headings
    html = html.replace(/<br \/><ul>/g, '<ul>');
    html = html.replace(/<\/ul><br \/>/g, '</ul>');
    html = html.replace(/<br \/>(<h[23])/g, '$1');


  return { __html: html };
};


const SpecOutput: React.FC<SpecOutputProps> = ({ spec }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(spec).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formattedSpec = useMemo(() => parseMarkdown(spec), [spec]);

  return (
    <div className="relative flex-grow flex flex-col">
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 mt-[-45px] mr-[-10px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 border border-gray-300 rounded-lg shadow-sm text-xs flex items-center gap-2"
      >
        <ClipboardIcon />
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <div className="prose prose-sm max-w-none flex-grow overflow-y-auto pr-4 text-gray-700" dangerouslySetInnerHTML={formattedSpec}>
      </div>
    </div>
  );
};

export default SpecOutput;
