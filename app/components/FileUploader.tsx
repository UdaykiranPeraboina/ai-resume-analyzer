import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] || null;
        setFile(selectedFile);
        onFileSelect?.(selectedFile);
    }, [onFileSelect]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: 20 * 1024 * 1024, // 20MB
    });
    
    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='space-y-4 cursor-pointer p-8'>
                    <div className='mx-auto w-16 h-16 flex items-center justify-center'>
                        <img src="/images/pdf.png" alt='upload' className='size-20'/>
                    </div>
                    
                    {file ? (
                        <div className='uploader-selected-file' onClick={(e)=> e.stopPropagation()}>
                            <div className='text-center'>
                            <p className='text-lg font-semibold text-gray-700'>{file.name}</p>
                            <p className='text-sm text-gray-500'>{formatSize(file.size)}</p>
                        </div>

                        <button className="cursor-pointer" onClick={(e)=>{
                            onFileSelect?.(null)
                        }}>
                            <img src="/icons/cross.svg" alt="Remove" className='w-6 h-6'/>
                        </button>
                        </div>
                        
                    ) : (
                        <div className='text-center'>
                            <p className='text-lg text-gray-500'>
                                <span className='font-semibold'>Click to Upload</span> or drag and drop
                            </p>
                            <p className='text-sm text-gray-500'>PDF max (20MB)</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;