

'use client';

import { useRef, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  className?: string;
}

export function FileDropArea({
  onFileSelect,
  accept,
  className = ""
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File>();

  const handleFile = (file: File) => {
    setFile(file);
    onFileSelect?.(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/60 hover:bg-muted/50',
            className
        )}
      >
        <Upload size={16} className="text-muted-foreground" />

        <div className="text-center">
          <p className="font-medium">
            Drag & drop a file here
          </p>

          <p className="text-sm text-muted-foreground">
            or click to browse
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose File
        </Button>

        {file && (
          <div className="mt-2 flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm">
            <File className="h-4 w-4" />
            <span className="truncate">{file.name}</span>
          </div>
        )}
      </div>
    </>
  );
}