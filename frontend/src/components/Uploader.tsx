import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Uploader = ({ onUploadSuccess }: { onUploadSuccess: () => void }) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files are supported at this time.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'File uploaded and processed successfully!');
        onUploadSuccess();
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch (err) {
      toast.error('Failed to connect to the server.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`group relative overflow-hidden rounded-[28px] border-2 border-dashed bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-300 ease-in-out cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-indigo-100 hover:border-primary/50 hover:bg-white'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#4f7cff]/12 via-transparent to-[#7c4dff]/12 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className="relative flex min-h-[310px] flex-col items-center justify-center p-10 text-center md:p-12">
          <div className="mb-5 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700">
            Central Upload Hub
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full shadow-lg
              ${isDragActive ? 'bg-primary text-primary-foreground shadow-primary/50' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}
            `}
          >
            {isUploading ? (
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </motion.div>
          
          <h3 className="mb-2 text-2xl font-semibold text-slate-900">
            {isUploading ? 'Processing your data...' : isDragActive ? 'Drop your CSV here' : 'Upload Lab Data'}
          </h3>
          <p className="max-w-lg text-sm text-slate-600">
            Drag and drop your clinical <span className="font-semibold text-indigo-600">.CSV</span> dataset here, or click to browse. PulseInsight will analyze every profile, classify each test, and generate readable report sections.
          </p>
          <p className="mt-3 max-w-xl text-xs text-slate-500">
            Optional CSV columns such as <span className="font-semibold">photo</span>, <span className="font-semibold">image</span>, or <span className="font-semibold">avatar</span> will be used for patient profile pictures.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">Upload once</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">Patient grouping</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">PDF reports</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
