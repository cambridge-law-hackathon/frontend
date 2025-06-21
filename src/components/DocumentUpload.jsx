'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner";
import { documentAPI, useAPI } from '@/lib/api';

const DocumentUpload = ({ companyId, companyName, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { callAPI, error } = useAPI();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'message/rfc822']; // PDF and EML
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type', 'Please select a PDF or EML file');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File too large', 'Please select a file smaller than 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No file selected', 'Please select a file to upload');
      return;
    }

    setUploading(true);
    
    try {
      const result = await callAPI(documentAPI.upload, companyId, selectedFile);
      
      toast.success('Document uploaded successfully!', `File: ${selectedFile.name}`);
      
      // Reset form
      setSelectedFile(null);
      
      // Clear file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <FileText className="h-4 w-4" />;
    
    if (file.type === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    } else if (file.type === 'message/rfc822') {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Document
          {companyName && (
            <Badge variant="outline" className="ml-2">
              {companyName}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload PDF or EML files for risk analysis. Maximum file size: 10MB
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file-input">Select File</Label>
            <Input
              id="file-input"
              type="file"
              accept=".pdf,.eml"
              onChange={handleFileSelect}
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
              {getFileIcon(selectedFile)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Processing document...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload; 