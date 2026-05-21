"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Download, User, Phone, GraduationCap, Plus, Edit3 } from "lucide-react";
import { getHocVien, saveHocVien, addHocVien, subscribeHocVien, DANH_SACH_LOP } from "../../lib/data";

const initialForm = {
  id: "",
  full_name: "",
  phone: "",
  class_name: "Cơ bản",
  create_at: "",
  age: "",
  tuition_date: "",
  parent_name: "",
  social_url: "",
  progress: "",
  notes: "",
  sessionsAttended: "0",
};

export default function DanhSachHocVienPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const dragStudentId = useRef<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setStudents(await getHocVien());
    };
    fetchData();

    const channel = subscribeHocVien(() => {
      fetchData();
    });

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  const handleDragStartStudent = (id: string) => {
    if (!editMode) return;
    dragStudentId.current = id;
  };

  const handleDropStudent = async (targetId: string) => {
    if (!editMode || !dragStudentId.current) return;
    const fromId = dragStudentId.current;
    if (fromId === targetId) return;

    const fromIndex = students.findIndex((s) => s.id === fromId);
    const targetIndex = students.findIndex((s) => s.id === targetId);
    if (fromIndex === -1 || targetIndex === -1) return;

    const next = [...students];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(targetIndex, 0, moved);
    setStudents(next);
    await saveHocVien(next);
    dragStudentId.current = null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.full_name.trim() || !formData.phone.trim()) {
      return alert("Vui lòng điền họ tên và SĐT liên hệ.");
    }

    const now = new Date().toISOString();
    const newStudent = {
      id: formData.id?.trim() || String(Date.now()),
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      class_name: formData.class_name,
      create_at: formData.create_at || now,
      age: Number(formData.age) || 0,
      tuition_date: formData.tuition_date,
      parent_name: formData.parent_name.trim(),
      social_url: formData.social_url.trim(),
      caHoc: [],
      progress: formData.progress.trim(),
      notes: formData.notes.trim(),
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
      "Mã học viên,Họ và tên,SĐT,Tên lớp,Ngày tạo,Tuổi,Ngày đóng học phí,Tên phụ huynh,Link MXH,Tiến trình,Ghi chú,Số buổi đã học\n" +
      students
        .map(
          (s) =>
            `${s.id},"${s.full_name || s.name}",${s.phone},"${s.class_name || s.lop}",${s.create_at || ""},${s.age || 0},${s.tuition_date || s.feeDate || ""},"${s.parent_name || s.parent}","${s.social_url || ""}","${s.progress}","${s.notes}",${s.sessionsAttended}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Danh_Sach_Hoc_Vien.csv";
    link.click();
  };

  const studentsByClass = DANH_SACH_LOP.map((className) => ({
    className,
    items: students.filter((s) => (s.class_name || s.lop) === className),
  }));

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
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Họ và tên học viên"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="Mã học viên (ID)"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Số điện thoại"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <select
              value={formData.class_name}
              onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            >
              {DANH_SACH_LOP.map((lop) => (
                <option key={lop} value={lop}>
                  {lop}
                </option>
              ))}
            </select>
            <input
              value={formData.create_at}
              onChange={(e) => setFormData({ ...formData, create_at: e.target.value })}
              type="datetime-local"
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
              value={formData.tuition_date}
              onChange={(e) => setFormData({ ...formData, tuition_date: e.target.value })}
              type="date"
              placeholder="Ngày đóng học phí"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              placeholder="Tên phụ huynh"
              className="border border-slate-200 rounded-2xl p-3 text-sm outline-none focus:border-indigo-400"
            />
            <input
              value={formData.social_url}
              onChange={(e) => setFormData({ ...formData, social_url: e.target.value })}
              placeholder="Link mạng xã hội"
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

        <div className="space-y-8">
          {studentsByClass.map(({ className, items }) => (
            <section key={className} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900">Lớp {className}</h2>
                <span className="text-sm text-slate-500">{items.length} học viên</span>
              </div>
              {items.length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có học viên trong lớp này.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      draggable={editMode}
                      onDragStart={() => handleDragStartStudent(s.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDropStudent(s.id)}
                      className={`bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm transition ${editMode ? "cursor-grab border-blue-200/80" : "hover:shadow-md"}`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                          <User size={24} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-800">{s.full_name || s.name}</h2>
                          <span className="text-xs text-slate-500">ID: {s.id}</span>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="grid gap-1 text-xs text-slate-500">
                          <p><span className="font-semibold text-slate-800">Lớp:</span> {s.class_name || s.lop}</p>
                          <p><span className="font-semibold text-slate-800">Ngày tạo:</span> {s.create_at || "Chưa có"}</p>
                          <p><span className="font-semibold text-slate-800">Tuổi:</span> {s.age ?? 0}</p>
                          <p><span className="font-semibold text-slate-800">Ngày đóng học phí:</span> {s.tuition_date || s.feeDate || "Chưa có"}</p>
                          <p><span className="font-semibold text-slate-800">Phụ huynh:</span> {s.parent_name || s.parent || "Chưa có"}</p>
                          <p><span className="font-semibold text-slate-800">SĐT:</span> {s.phone || "Chưa có"}</p>
                          <p><span className="font-semibold text-slate-800">MXH:</span> {s.social_url ? <a href={s.social_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{s.social_url}</a> : "Chưa có"}</p>
                          <p><span className="font-semibold text-slate-800">Tiến trình:</span> {s.progress || "Chưa cập nhật"}</p>
                          <p><span className="font-semibold text-slate-800">Số buổi đã học:</span> {s.sessionsAttended ?? 0}</p>
                          <p><span className="font-semibold text-slate-800">Ghi chú:</span> {s.notes || "Không có"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
