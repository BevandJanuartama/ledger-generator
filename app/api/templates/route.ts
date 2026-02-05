import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Cari lokasi folder public/template
    const templateDir = path.join(process.cwd(), "public/template");

    // Cek apakah folder ada
    if (!fs.existsSync(templateDir)) {
      console.error("Folder public/template tidak ditemukan!");
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(templateDir);
    const excelFiles = files.filter((file) => file.endsWith(".xlsx"));

    return NextResponse.json(excelFiles);
  } catch (error) {
    console.error("Gagal baca folder:", error);
    return NextResponse.json([]);
  }
}
