"use client";
import { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ExcelPage() {
  const [names, setNames] = useState("");
  const [templateList, setTemplateList] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [loading, setLoading] = useState(false);

  // Ambil daftar file otomatis saat halaman dibuka
  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTemplateList(data);
          setSelectedTemplate(data[0]); // Pilih file pertama sebagai default
        }
      });
  }, []);

  const generateExcels = async () => {
    if (!names) return alert("Masukkan nama dulu!");
    setLoading(true);

    try {
      // Path disesuaikan dengan folder baru kamu
      const response = await fetch(`/template/${selectedTemplate}`);
      const arrayBuffer = await response.arrayBuffer();

      const nameList = names
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n !== "");

      for (const name of nameList) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${name}.xlsx`);
      }
      alert("Selesai!");
    } catch (error) {
      alert("Gagal memproses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 flex flex-col items-center gap-5">
      <h1 className="text-2xl font-bold">Auto Template Generator</h1>

      <div className="w-full max-w-md">
        <label className="block mb-2 font-medium">
          Pilih dari folder /template:
        </label>
        <select
          className="w-full p-3 border rounded-lg text-black bg-white"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          {templateList.map((fileName) => (
            <option key={fileName} value={fileName}>
              {fileName}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full max-w-md p-3 border rounded-lg text-black"
        rows={5}
        placeholder="Nama1, Nama2..."
        value={names}
        onChange={(e) => setNames(e.target.value)}
      />

      <button
        onClick={generateExcels}
        disabled={loading || !selectedTemplate}
        className="bg-blue-600 text-white py-3 px-8 rounded-lg disabled:bg-gray-400"
      >
        {loading ? "Memproses..." : "Generate Sekarang"}
      </button>
    </main>
  );
}
