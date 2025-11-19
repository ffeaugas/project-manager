'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  value?: File | string | null;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  ({ onFileSelect, accept = 'image/*', maxSize = 5, className, value }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [preview, setPreview] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (value) {
        if (typeof value === 'string') {
          setPreview(value);
        } else if (value instanceof File) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(value);
        }
      } else {
        setPreview(null);
      }
    }, [value]);

    const validateFile = (file: File): boolean => {
      setError(null);

      if (maxSize && file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return false;
      }

      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        setError('Invalid file type');
        return false;
      }

      return true;
    };

    const handleFile = (file: File) => {
      if (validateFile(file)) {
        onFileSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    };

    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(null);
      setError(null);
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <div ref={ref} className={cn('w-full', className)}>
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative cursor-pointer rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-zinc-700 hover:border-zinc-600',
            error && 'border-red-500',
            preview ? 'p-2' : 'p-8',
          )}
        >
          {preview ? (
            <div className="relative group">
              <Image
                width={100}
                height={100}
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                <p className="text-white text-sm">Click to change image</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-10 w-10 text-zinc-500" />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-zinc-200">Click to upload</span> or
                  drag and drop
                </p>
                <p className="text-xs text-zinc-500">
                  {accept} (max {maxSize}MB)
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
    );
  },
);

Dropzone.displayName = 'Dropzone';

export { Dropzone };
