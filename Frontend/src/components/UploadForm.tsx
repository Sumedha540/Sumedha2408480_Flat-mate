import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloudIcon, XIcon, FileIcon, ImageIcon } from 'lucide-react';
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  type: 'image' | 'document';
}
interface UploadFormProps {
  onUpload?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
}
export function UploadForm({
  onUpload,
  accept = 'image/*,.pdf,.doc,.docx',
  maxFiles = 5
}: UploadFormProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };
  const processFiles = (newFiles: File[]) => {
    const remainingSlots = maxFiles - files.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);
    const uploadedFiles: UploadedFile[] = filesToAdd.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      type: file.type.startsWith('image/') ? 'image' : 'document'
    }));
    setFiles(prev => [...prev, ...uploadedFiles]);
    // Simulate upload progress
    uploadedFiles.forEach(file => {
      simulateUpload(file.id);
    });
    onUpload?.(filesToAdd);
  };
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setFiles(prev => prev.map(f => f.id === fileId ? {
        ...f,
        progress
      } : f));
    }, 200);
  };
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  return <div className="space-y-4">
      {/* Drop Zone */}
      <div onDragOver={e => {
      e.preventDefault();
      setIsDragging(true);
    }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`
          relative border-2 border-dashed rounded-card p-8
          transition-colors duration-200 text-center
          ${isDragging ? 'border-button-primary bg-background-accent' : 'border-gray-300 hover:border-button-primary'}
        `}>
        <input type="file" accept={accept} multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Upload files" />
        <UploadCloudIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-primary font-medium mb-1">Drag & drop files here</p>
        <p className="text-sm text-gray-500">
          or click to browse (max {maxFiles} files)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && <div className="space-y-3">
          {files.map(file => <motion.div key={file.id} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} className="flex items-center gap-3 p-3 bg-background-light rounded-button">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                {file.type === 'image' ? <ImageIcon className="w-5 h-5 text-button-primary" /> : <FileIcon className="w-5 h-5 text-button-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                {file.progress < 100 && <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-button-primary rounded-full" initial={{
              width: 0
            }} animate={{
              width: `${file.progress}%`
            }} />
                  </div>}
              </div>
              <button onClick={() => removeFile(file.id)} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors" aria-label={`Remove ${file.name}`}>
                <XIcon className="w-4 h-4 text-gray-500" />
              </button>
            </motion.div>)}
        </div>}
    </div>;
}