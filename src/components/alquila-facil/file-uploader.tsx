
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface FileUploaderProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export function FileUploader({ value, onChange }: FileUploaderProps) {
  const { dictionary } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState(value?.name || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setFileName(file.name);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onChange(file);
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
    setFileName(null);
  };
  
  const triggerFileInput = () => {
    document.getElementById(id)?.click();
  }

  const id = `file-upload-${React.useId()}`;

  if (fileName) {
    return (
        <div className="p-4 border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
                <File className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium truncate max-w-[150px]">{fileName}</span>
            </div>
            {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
  }

  return (
    <div 
        className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={triggerFileInput}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <UploadCloud className="h-8 w-8" />
        <span className="font-semibold text-sm">{dictionary.documents.upload}</span>
      </div>
      <Input
        id={id}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, application/pdf"
      />
    </div>
  );
}
