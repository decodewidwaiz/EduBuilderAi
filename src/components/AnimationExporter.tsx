import { motion } from 'framer-motion';
import { Download, Share2, Code, Copy } from 'lucide-react';
import { AnimationSequence } from '../types/animations';

interface AnimationExporterProps {
  animation: AnimationSequence;
}

const AnimationExporter = ({ animation }: AnimationExporterProps) => {
  const handleExportJSON = () => {
    const json = JSON.stringify(animation, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animation.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${animation.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root" class="w-full h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
            <h1 class="text-3xl font-bold text-[#1C1C1C] mb-2">${animation.title}</h1>
            <p class="text-gray-600 mb-6">${animation.description}</p>
            <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-blue-900">
                    <strong>Animation Data:</strong> This animation has ${animation.totalSteps} steps.
                    Import the accompanying JSON file to use with the EduBuilder AI Animation Player.
                </p>
            </div>
            <div class="mt-6 p-4 bg-gray-100 rounded-lg overflow-x-auto">
                <pre class="text-xs"><code>${JSON.stringify(animation, null, 2)}</code></pre>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animation.title.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyEmbedCode = () => {
    const embedCode = `<iframe src="https://edubuilder.ai/animate/${animation.id}" width="100%" height="600" frameborder="0" allow="fullscreen"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  const handleCopyJSON = () => {
    const jsonString = JSON.stringify(animation, null, 2);
    navigator.clipboard.writeText(jsonString);
    alert('Animation JSON copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-4"
    >
      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Download className="w-5 h-5 text-[#E63946]" />
          <h4 className="font-semibold text-[#1C1C1C]">Export JSON</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Download as JSON for use in other projects
        </p>
        <button
          onClick={handleExportJSON}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-semibold text-sm"
        >
          Download JSON
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Code className="w-5 h-5 text-[#E63946]" />
          <h4 className="font-semibold text-[#1C1C1C]">Export HTML</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Download as standalone HTML file
        </p>
        <button
          onClick={handleExportHTML}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 font-semibold text-sm"
        >
          Download HTML
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Share2 className="w-5 h-5 text-[#E63946]" />
          <h4 className="font-semibold text-[#1C1C1C]">Embed Code</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Copy embed code for LMS or websites
        </p>
        <button
          onClick={handleCopyEmbedCode}
          className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy Embed Code
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <Copy className="w-5 h-5 text-[#E63946]" />
          <h4 className="font-semibold text-[#1C1C1C]">Copy JSON</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Copy animation data to clipboard
        </p>
        <button
          onClick={handleCopyJSON}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy JSON
        </button>
      </div>
    </motion.div>
  );
};

export default AnimationExporter;
