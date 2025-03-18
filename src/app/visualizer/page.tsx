"use client"
import { useEffect, useState } from "react";
import SubCategorySelector from "./SubCategory";
import CategorySelector from "./Category";
import DataTable from "./DataTable";
  
export default function  Visualizer(){
    const [csvData, setCsvData] = useState<JSON[] | null>(null);
    const [category, setCategory] = useState<string | null>(null);
    const [subCategory, setSubCategory] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<JSON[] | null>(null);
    const [categories, setCategories] = useState<string[] |null>(null);
    const [subCategories, setSubCategories] = useState< {[key: string]: string[]}|null>(null);  
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [fileName, setFileName] = useState<String>();
    
    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
      // Also toggle dark class on document if using Tailwind's dark mode
      document.documentElement.classList.toggle('dark');
    };
//fetch filename whenever it changes
    useEffect(() => {
      const storedFileName = localStorage.getItem("fileName");
      if (storedFileName) {
        setFileName(storedFileName);
      }
    }, []);
   //fetch csv whenever it changes
   useEffect(() => {
    const data = localStorage.getItem("csvData");
    if (data) {
      const parsedData = JSON.parse(data);
      setCsvData(parsedData);
  
      // ✅ Extract categories and subcategories
      const categorySet = new Set<string>();
      const subcategoryMap: { [key: string]: string[] } = {};
  
      parsedData.forEach((row: any) => {
        const category = row["Category"];
        const subCategory = row["Sub-category"];
  
        if (category) {
          categorySet.add(category);
          if (!subcategoryMap[category]) {
            subcategoryMap[category] = [];
          }
          if (subCategory && !subcategoryMap[category].includes(subCategory)) {
            subcategoryMap[category].push(subCategory);
          }
        }
      });
  
      setCategories(Array.from(categorySet));
      setSubCategories(subcategoryMap);
  
      console.log("Categories:", Array.from(categorySet));
      console.log("Subcategories:", subcategoryMap);
    } else {
      alert("No data found");
    }
  }, []);
  
    //filter data whenever category or subcategory changes
    useEffect(() => {
        if (csvData) {
          // ✅ Directly use the parsed JSON data
          const parsedData = csvData;
          setFilteredData(parsedData);
         
         
          if (category && subCategory) {
            //@ts-ignore
            const filtered = parsedData.filter(
              (row: any) =>
                row["Category"] === category && row["Sub-category"] === subCategory
            );
            setFilteredData(filtered);
            console.log("Filtered Data with Category and SubCategory:", filtered);
          } else if (category) {
            //@ts-ignore
            const filtered = parsedData.filter(
              (row: any) => row["Category"] === category
            );
            setFilteredData(filtered);
            console.log("Filtered Data with Category:", filtered);
          }
        }
      }, [category, subCategory, csvData]);
      return (
        <div className="container mx-auto p-6 bg-white dark:bg-gray-800 min-h-screen transition-colors duration-200">
        {/* Header section with title, filename and dark mode toggle */}
      {/* Header section with title, filename, back button and dark mode toggle */}
<div className="flex justify-between items-center mb-6">
  <div className="flex items-center gap-4">
    <button 
      onClick={() => window.location.href = '/'}
      className="flex items-center gap-1 px-3 py-2 rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 transition-colors duration-200"
      aria-label="Back to upload"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      Upload New File
    </button>
  </div>

  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">CSV Visualizer</h1>
  
  <div className="flex items-center gap-4">
    {fileName && (
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        File: {fileName}
      </span>
    )}
    
    <button 
      onClick={toggleDarkMode} 
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
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
</div>
        
        {/* Selectors row - side by side */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="w-full sm:w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Categories</h2>
            <CategorySelector 
              categories={categories} 
              setCategory={setCategory} 
              setSubCategory={setSubCategory}
            />
          </div>
          
          <div className="w-full sm:w-1/2">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Sub-Categories</h2>
            <SubCategorySelector
  
              subCategories={subCategories} 
              category={category} 
              setSubCategory={setSubCategory}
            />
          </div>
        </div>
        
        {/* Full width table */}
        <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
          <DataTable filteredData={filteredData} />
        </div>
      </div>
  );
    
}

