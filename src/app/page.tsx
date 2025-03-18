"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Papa from 'papaparse';

export default function Upload() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const Router = useRouter();

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    if (isFileUploaded) {
      Router.push("/visualizer");
    }
  }, [isFileUploaded, Router]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  async function handleUploadCsv() {
    if (fileRef.current?.files?.[0]) {
      const file = fileRef.current.files[0];
      
      // Check file type
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        alert("Please upload a valid CSV file");
        return;
      }

      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append("file", file);
        
        // Send the request using axios
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await file.text();
        const results = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          quoteChar: '"',
          escapeChar: '"'
        });

        // Save to localStorage
        localStorage.removeItem("csvData");
        localStorage.setItem("csvData", JSON.stringify(results.data));
        localStorage.removeItem("fileName");
        localStorage.setItem("fileName", file.name);
        
        setIsFileUploaded(true);
      } catch (error: any) {
        console.error("Error uploading file:", error);
        alert(`Failed to upload file: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert("Please select a file");
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (fileRef.current) {
        fileRef.current.files = e.dataTransfer.files;
        await handleUploadCsv();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-white shadow-md"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to CSV Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
            Upload your CSV file to visualize and analyze your data
          </p>
        </div>
        
        <div 
          className={`w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-200
            ${dragActive ? 'border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border border-gray-200 dark:border-gray-700'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <h2 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-200">
              {dragActive ? 'Drop your CSV file here' : 'Drop your file here or click to browse'}
            </h2>
            
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Support for .CSV files only
            </p>
            
            <div className="mt-6">
              <label className="block">
                <input 
                  type="file"
                  accept=".csv"
                  ref={fileRef}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    dark:file:bg-blue-900/20 dark:file:text-blue-300
                    hover:file:bg-blue-100 dark:hover:file:bg-blue-900/30
                    transition-all duration-200"
                />
              </label>
            </div>
          </div>
        </div>
        
        <button 
          className={`mt-6 px-8 py-3 rounded-lg font-medium text-white shadow-md
            transition-all duration-200 transform hover:translate-y-px
            ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'}`}
          onClick={handleUploadCsv}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload CSV'
          )}
        </button>
      </div>
    </div>
  );
}