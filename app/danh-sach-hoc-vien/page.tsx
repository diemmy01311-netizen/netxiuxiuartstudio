"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Cần Import Link để chuyển trang
import { ArrowLeft, Download, User, Phone, GraduationCap, Plus, Edit3 } from "lucide-react";
import { getHocVien, saveHocVien } from "../../lib/data";

export default function DanhSachHocVienPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const dragStudentIndex = useRef<number | null>(null);

  useEffect(() => {
    setStudents(getHocVien());
  }, []);

  const handleDragStartStudent = (index: number) => {
    if (!editMode) return;
    dragStudentIndex.current = index;
  };

  const handleDropStudent = (index: number) => {
    if (!editMode || dragStudentIndex.current === null) return;
    const from = dragStudentIndex.current;
    if (from === index) return;

    const next = [...students];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setStudents(next);
    saveHocVien(next);
    dragStudentIndex.current = null;
  };

  const handleAddStudent = () => {
    const name = prompt("Tên bé");
    if (!name) return;
    const age = prompt("Tuổi bé");
    if (!age) return;
    const parent = prompt("Tên phụ huynh");
    if (!parent) return;
    const phone = prompt("Số điện thoại");
    if (!phone) return;

    const newStudent = {
      id: Date.now(),
      name: name.trim(),
      age: Number(age),
      parent: parent.trim(),
      phone: phone.trim(),
      lop: "Cơ bản",
      caHoc: []
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    saveHocVien(updated);
  };

  const handleExport = () => {
    const csvContent = "\uFEFF" + "Tên,Tuổi,Phụ Huynh,SĐT\n" + 
      students.map(s => `${s.name},${s.age},${s.parent},${s.phone}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Danh_Sach_Hoc_Vien.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* THANH ĐIỀU HƯỚNG TỐI ƯU */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Nút Quay lại */}
          <Link href="/" className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-indigo-600 transition">
            <ArrowLeft size={18} /> Quay lại trang chủ
          </Link>

          {/* Nhóm nút chức năng */}
          <div className="flex gap-2">
            <button onClick={handleAddStudent} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition">
              <Plus size={16} /> Thêm bé
            </button>
            <button onClick={() => setEditMode(!editMode)} className={`bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition border border-slate-200 ${editMode ? "bg-slate-100" : "hover:bg-slate-50"}`}>
              {editMode ? "Tắt kéo thả" : "Bật kéo thả"}
            </button>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition">
              <Edit3 size={16} /> Sửa
            </button>
            <button 
              onClick={handleExport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <Download size={16} /> Tải Excel
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">Danh sách Học viên</h1>

        {/* LƯỚI DANH SÁCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((s, i) => (
            <div
              key={s.id ?? i}
              draggable={editMode}
              onDragStart={() => handleDragStartStudent(i)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDropStudent(i)}
              className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition ${editMode ? "cursor-grab border-blue-200/80" : "hover:shadow-md"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{s.name}</h2>
                  <span className="text-xs text-slate-500">{s.age} tuổi</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-slate-400" />
                  <span>PH: <span className="font-medium text-slate-900">{s.parent}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  <span>SĐT: <span className="font-medium text-slate-900">{s.phone}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}