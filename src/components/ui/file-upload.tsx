"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onChange: (files: File[]) => void;
  isUploading?: boolean;
  error?: string;
  className?: string;
}

export function FileUpload({
  onChange,
  isUploading = false,
  error,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-center text-muted-foreground">
          {isDragActive
            ? "Drop the file here"
            : "Drag & drop a file here, or click to select"}
        </p>
        <p className="text-xs text-center text-muted-foreground mt-1">
          Supported formats: JPG, PNG, PDF
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>Selected file:</Label>
          <div className="flex items-center gap-2 p-2 border rounded-md">
            <span className="text-sm truncate flex-1">
              {files[0].name}
            </span>
            <span className="text-xs text-muted-foreground">
              {(files[0].size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {isUploading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          <span className="ml-2 text-sm">Uploading...</span>
        </div>
      )}
    </div>
  );
}
