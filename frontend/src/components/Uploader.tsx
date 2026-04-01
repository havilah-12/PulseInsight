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
    <div className="mb-8">
      <div 
        {...getRootProps()} 
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out cursor-pointer group bg-card/40 backdrop-blur-sm
          ${isDragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative p-10 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isDragActive ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg
              ${isDragActive ? 'bg-primary text-primary-foreground shadow-primary/50' : 'bg-white/10 text-white/70 group-hover:bg-primary/20 group-hover:text-primary'}
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
          
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            {isUploading ? 'Processing your data...' : isDragActive ? 'Drop your CSV here' : 'Upload Lab Data'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Drag and drop your clinical <span className="font-semibold text-primary">.CSV</span> dataset here, or click to browse. Our NLP engine will automatically extract diseases and compute severity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
