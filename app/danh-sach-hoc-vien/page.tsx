"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, User, Phone, GraduationCap, Plus, Edit3 } from "lucide-react";
import { getHocVien, saveHocVien, addHocVien, DANH_SACH_LOP } from "../../lib/data";

const initialForm = {
  name: "",
  age: "",
  parent: "",
  phone: "",
  lop: "Cơ bản",
  progress: "",
  notes: "",
  feeDate: "",
  sessionsAttended: "0",
};

export default function DanhSachHocVienPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const dragStudentIndex = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setStudents(await getHocVien());
    };
    fetchData();
  }, []);

  const handleDragStartStudent = (index: number) => {
    if (!editMode) return;
    dragStudentIndex.current = index;
  };

  const handleDropStudent = async (index: number) => {
    if (!editMode || dragStudentIndex.current === null) return;
    const from = dragStudentIndex.current;
    if (from === index) return;

    const next = [...students];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setStudents(next);
    await saveHocVien(next);
    dragStudentIndex.current = null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      return alert("Vui lòng điền tên và SĐT liên hệ.");
    }

    const newStudent = {
      id: Date.now(),
      name: formData.name.trim(),
      age: Number(formData.age) || 0,
      parent: formData.parent.trim(),
      phone: formData.phone.trim(),
      lop: formData.lop,
      caHoc: [],
      progress: formData.progress.trim(),
      notes: formData.notes.trim(),
      feeDate: formData.feeDate,
      sessionsAttended: Number(formData.sessionsAttended) || 0,
    };

    const added = await addHocVien(newStudent);
    const next = [...students, added || newStudent];
    setStudents(next);
    setFormData(initialForm);
  };

  const handleExport = () => {
    const csvContent =
      "\uFEFF" +
      "Tên,Tuổi,Phụ Huynh,SĐT,Lớp,Tiến trình,Ghi chú,Ngày đóng học phí,Số buổi đã học\n" +
      students
        .map(
          (s) =>
            `${s.name},${s.age},${s.parent},${s.phone},${s.lop},"${s.progress}","${s.notes}",${s.feeDate},${s.sessionsAttended}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Danh_Sach_Hoc_Vien.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-indigo-600 transition">
              <ArrowLeft size={18} /> Quay lại trang chủ
            </Link>
            <h1 className="text-3xl font-black text-slate-900 mt-4">Danh sách Học viên</h1>
            <p className="text-sm text-slate-500">Thông tin học viên được lưu và đồng bộ toàn bộ web.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowForm((prev) => !prev)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
              {showForm ? "Ẩn form" : "Hiện form"}
            </button>
            <button onClick={() => setEditMode((prev) => !prev)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${editMode ? "bg-slate-100 text-slate-900 border border-slate-200" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
              {editMode ? "Tắt kéo thả" : "Bật kéo thả"}
            </button>
            <button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2">
              <Download size={16} /> Tải Excel
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Tên bé"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Tuổi"
              type="number"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.parent}
              onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
              placeholder="Phụ huynh"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Số điện thoại"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <select
              value={formData.lop}
              onChange={(e) => setFormData({ ...formData, lop: e.target.value })}
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            >
              {DANH_SACH_LOP.map((lop) => (
                <option key={lop} value={lop}>
                  {lop}
                </option>
              ))}
            </select>
            <input
              value={formData.feeDate}
              onChange={(e) => setFormData({ ...formData, feeDate: e.target.value })}
              type="date"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.sessionsAttended}
              onChange={(e) => setFormData({ ...formData, sessionsAttended: e.target.value })}
              placeholder="Số buổi đã học"
              type="number"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              placeholder="Tiến trình học"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú"
              className="col-span-1 md:col-span-2 border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400 h-28 resize-none"
            />
            <button type="submit" className="col-span-1 md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-3 text-sm font-bold transition">
              Lưu học viên
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((s, i) => (
            <div
              key={s.id ?? i}
              draggable={editMode}
              onDragStart={() => handleDragStartStudent(i)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDropStudent(i)}
              className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition ${editMode ? "cursor-grab border-blue-200/80" : "hover:shadow-md"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{s.name}</h2>
                  <span className="text-xs text-slate-500">{s.age} tuổi • {s.lop}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">PH: <span className="font-semibold text-slate-900">{s.parent}</span></span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">SĐT: <span className="font-semibold text-slate-900">{s.phone}</span></span>
                </div>
                <div className="grid gap-1 text-xs text-slate-500">
                  <p><span className="font-semibold text-slate-800">Tiến trình:</span> {s.progress || "Chưa cập nhật"}</p>
                  <p><span className="font-semibold text-slate-800">Ngày đóng học phí:</span> {s.feeDate || "Chưa có"}</p>
                  <p><span className="font-semibold text-slate-800">Số buổi đã học:</span> {s.sessionsAttended ?? 0}</p>
                  <p><span className="font-semibold text-slate-800">Ghi chú:</span> {s.notes || "Không có"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
