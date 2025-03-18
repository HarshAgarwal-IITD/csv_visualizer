import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  export default function CategorySelector({categories,setCategory,setSubCategory}:{categories:string[]|null,setCategory:Function,setSubCategory:Function}){
    return(
        <Select onValueChange={(value) => { setCategory(value); setSubCategory(null) }}>
      <SelectTrigger className="w-full bg-white border border-gray-200 rounded-md">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-700">
        {categories?.map((category) => (
          <SelectItem key={category} value={category} className=" dark:text-gray-100">
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
        
    )
}