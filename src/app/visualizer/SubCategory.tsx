import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
export default function  SubCategorySelector({subCategories,category,setSubCategory}:{subCategories: {[key: string]: string[]}
    |null,category:string|null, setSubCategory:Function}
   ){ 
    const hasOptions = category && subCategories && subCategories[category]?.length > 0;

   return(
    <Select onValueChange={(value) => setSubCategory(value)} disabled={!hasOptions}>
    <SelectTrigger className="w-full bg-white border border-gray-200 rounded-md">
      <SelectValue placeholder="Select Sub-Category" />
    </SelectTrigger>
    <SelectContent className="bg-white  dark:bg-gray-700">
      {hasOptions && subCategories[category].map((subCategory) => (
        <SelectItem key={subCategory} value={subCategory} className="hover:bg-gray-100 ">
          {subCategory}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
        
    )
    

}
