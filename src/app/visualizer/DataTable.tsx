
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
export default function DataTable({ filteredData }: { filteredData: Record<string, any>[] | null  }) {
    if (!filteredData ) {
      return  <div className="flex items-center justify-center h-64 text-gray-500">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-2 font-medium">No data available</p>
        <p className="mt-1 text-sm">Please select a category to view data</p>
      </div>
    </div>
    }
  
    return (
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {Object.keys(filteredData[0]).map((key) => (
                <TableHead key={key} className="py-3 font-semibold text-gray-700">
                  {key}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className="hover:bg-gray-200 border-b border-gray-100 hover:text-gray-700"
              >
                {Object.values(row).map((value, cellIndex) => (
                  <TableCell key={cellIndex} className="py-3">
                    {value ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }