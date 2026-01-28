import { useCallback, useState } from "react";
import { Upload, FileText, Image, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing?: boolean;
  acceptedTypes?: string;
}

export function FileUpload({ 
  onFileSelect, 
  isAnalyzing = false,
  acceptedTypes = ".pdf,.png,.jpg,.jpeg,.webp,.txt"
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-8 w-8 text-primary" />;
    }
    return <FileText className="h-8 w-8 text-primary" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
            isDragging 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
          )}
        >
          <input
            type="file"
            className="hidden"
            accept={acceptedTypes}
            onChange={handleFileInput}
          />
          
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className={cn(
              "p-4 rounded-full mb-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-secondary"
            )}>
              <Upload className={cn(
                "h-10 w-10 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            
            <p className="mb-2 text-lg font-medium text-foreground">
              {isDragging ? "Drop your file here" : "Upload Medical Report"}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop or <span className="text-primary font-medium">browse</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              PDF, Images (PNG, JPG), or Text files
            </p>
          </div>
        </label>
      ) : (
        <div className="w-full p-6 bg-card border rounded-xl animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              {getFileIcon(selectedFile)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Analyzing...</span>
              </div>
            ) : (
              <button
                onClick={clearFile}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}