"use client";
import { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function ExcelPage() {
  const [names, setNames] = useState("");
  const [loading, setLoading] = useState(false);

  const generateExcels = async () => {
    if (!names) return alert("Masukkan daftar nama terlebih dahulu!");
    setLoading(true);

    try {
      const response = await fetch("/template.xlsx");
      if (!response.ok)
        throw new Error("File /public/template.xlsx tidak ditemukan!");
      const arrayBuffer = await response.arrayBuffer();

      const nameList = names
        .split(/,|\n/)
        .map((n) => n.trim()) // Membersihkan spasi di awal/akhir nama saja
        .filter((n) => n !== ""); // Menghapus entri kosong

      for (const name of nameList) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${name}.xlsx`);
      }
    } catch (error) {
      console.error(error);
      alert("Error: Pastikan file template.xlsx sudah ada di folder public/");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background diubah ke gradasi agar lebih hidup
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 flex items-center justify-center p-4 text-slate-900 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 border border-white p-8 md:p-12 relative overflow-hidden">
        {/* Dekorasi Aksen Warna di Pojok */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        <div className="text-center mb-10 relative">
          {/* Ikon dengan warna yang lebih kontras */}
          <div className="w-20 h-20 bg-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h2" />
              <path d="M8 17h2" />
              <path d="M14 13h2" />
              <path d="M14 17h2" />
            </svg>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Excel <span className="text-green-600">Maker</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2">
            Automate your spreadsheet workflow.
          </p>
        </div>

        <div className="space-y-8 relative">
          <div className="space-y-3">
            <label className="flex flex-col ml-1">
              {/* Teks Label Utama */}
              <span className="text-m font-bold uppercase tracking-widest text-indigo-900/60">
                Masukkan Nama File
              </span>

              {/* Teks Instruksi Kecil Merah */}
              <span className="text-[14px] leading-tight text-red-500 font-medium mt-1">
                *Jika ingin membuat lebih dari satu file maka pisahkan dengan
                koma.
              </span>
            </label>

            {/* Input Textarea */}
            <textarea
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-[1.5rem] px-6 py-5 focus:ring-0 focus:border-indigo-500 transition-all outline-none min-h-44 resize-none text-slate-800 font-medium placeholder:text-slate-400 shadow-inner"
              placeholder="Contoh: Laporan Januari, Laporan Februari"
              value={names}
              onChange={(e) => setNames(e.target.value)}
            />
          </div>

          {/* Tombol dengan warna Emerald/Hijau agar terlihat 'Actionable' */}
          <button
            onClick={generateExcels}
            disabled={loading}
            className="group w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold py-5 rounded-[1.5rem] transition-all shadow-xl shadow-green-200 active:scale-[0.95] flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            )}
            <span>{loading ? "Processing..." : "Download Files"}</span>
          </button>
        </div>

        {/* Info Box dengan warna yang lebih kontras */}
        <div className="mt-8 flex items-center gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
          <div className="bg-green-600 text-white p-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
              <path d="M12 8v4" />
            </svg>
          </div>
          <p className="text-xs font-bold text-green-900 leading-tight">
            Satu klik untuk semua file. Pastikan pop-up download diizinkan.
          </p>
        </div>
      </div>
    </div>
  );
}
