import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import csvParser from "csv-parser";
import { PrismaClient } from "@prisma/client";  // ✅ Import PrismaClient
const prisma = new PrismaClient();

const headerMapping: Record<string, string> = {
  "Category": "category",
  "Sub-category": "subCategory",
  "Part No.": "partNumber",
  "Datasheet Link (PDF)": "datasheetUrl",
  "VDSS\r\nV": "vdssV",
  "VGS\r\nV": "vgsV",
  "VTH\r\nMin\r\nV": "vthMinV",
  "VTH\r\nMax\r\nV": "vthMaxV",
  "ID(A) / TA=25": "idATA25",
  "VTH(V) Max.": "vthVMax",
  "Ron 4.5v\n(mΩ)Max.": "ron4_5vMax",
  "Ron 10v\n(mΩ)Max.": "ron10vMax"
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // @ts-ignore
  const buffer = Buffer.from(await file.arrayBuffer());
  // @ts-ignore
  const filename = file.name.replaceAll(" ", "_");

  try {
    // ✅ Save file to public/uploads
    const filePath = path.join(process.cwd(), "public/uploads", `${Date.now()}_${filename}`);
    await writeFile(filePath, buffer);
    console.log(`File saved to: ${filePath}`);

    const records: any[] = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
          // ✅ Map headers to schema fields
          const mappedRow: Record<string, string | null> = {};
          for (const key in row) {
            const cleanedKey = key.trim();
            const mappedKey = headerMapping[cleanedKey];
            if (mappedKey) {
              mappedRow[mappedKey] = row[key]?.trim() || null; // Save as null if empty
            }
          }
          records.push(mappedRow);
        })
        .on("end", resolve)
        .on("error", reject);
    });

   
  
    console.log("CSV Records:",records);


    // // ✅ Insert into database
    // for (const record of records) {
    //   if (!record.category || !record.subCategory || !record.partNumber || !record.datasheetUrl) {
    //     console.error("Invalid data:", record);
    //     continue;
    //   }

    //   await prisma.product.create({
    //     data: record, // ✅ Directly insert mapped record
    //   });
    // }

    // ✅ Remove the file after processing
    fs.unlinkSync(filePath);

    return NextResponse.json({ message: "CSV uploaded and data saved" }, { status: 201 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
