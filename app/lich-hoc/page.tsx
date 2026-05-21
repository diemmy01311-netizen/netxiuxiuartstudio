"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getHocThu, addHocThu, saveHocThu, DANH_SACH_LOP } from "../../lib/data";

export default function LichHocThuPage() {
  const [data, setData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const dragScheduleIndex = useRef<number | null>(null);
  // Thêm 'date' và 'time' vào state khởi tạo
  const [formData, setFormData] = useState({ name: "", age: "", parent: "", phone: "", lop: "Cơ bản", date: "", time: "" });

  useEffect(() => {
    setData(getHocThu());
  }, []);

  const handleDragStartSchedule = (index: number) => {
    if (!editMode) return;
    dragScheduleIndex.current = index;
  };

  const handleDropSchedule = (index: number) => {
    if (!editMode || dragScheduleIndex.current === null) return;
    const from = dragScheduleIndex.current;
    if (from === index) return;

    const next = [...data];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    setData(next);
    saveHocThu(next);
    dragScheduleIndex.current = null;
  };

  const handleAdd = () => {
    if (!formData.name || !formData.phone) return alert("Vui lòng nhập tên bé và SĐT");
    const updatedData = addHocThu(formData);
    setData(updatedData);
    setShowForm(false);
    setFormData({ name: "", age: "", parent: "", phone: "", lop: "Cơ bản", date: "", time: "" });
  };

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <Link href="/" className="text-xs font-bold text-stone-500 flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> QUAY LẠI TRANG CHỦ
          </Link>
          <h1 className="text-2xl font-black text-stone-900">LỊCH HỌC THỬ</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(!showForm)} className="bg-stone-900 text-white px-4 py-2 rounded-lg font-bold text-sm">
            {showForm ? "Đóng" : "+ Thêm Lịch"}
          </button>
          <button onClick={() => setEditMode(!editMode)} className={`bg-white text-stone-700 px-4 py-2 rounded-lg text-sm font-bold border border-stone-200 transition ${editMode ? "bg-stone-100" : "hover:bg-stone-50"}`}>
            {editMode ? "Đang kéo thả" : "Bật kéo thả"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="max-w-4xl mx-auto bg-white p-4 rounded-xl border border-stone-200 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <input placeholder="Tên bé" className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input placeholder="Tuổi" className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, age: e.target.value})} />
          <input placeholder="Phụ huynh" className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, parent: e.target.value})} />
          <input placeholder="Số ĐT" className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <select className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, lop: e.target.value})}>
            {DANH_SACH_LOP.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          {/* Trường Ngày và Giờ mới */}
          <input type="date" className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, date: e.target.value})} />
          <input type="time" className="p-2 border rounded text-sm" onChange={e => setFormData({...formData, time: e.target.value})} />
          
          <button onClick={handleAdd} className="col-span-2 md:col-span-4 bg-emerald-600 text-white p-2 rounded font-bold text-sm">
            LƯU LỊCH HỌC
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3">
        {data.map((h, index) => (
          <div
            key={h.id}
            draggable={editMode}
            onDragStart={() => handleDragStartSchedule(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDropSchedule(index)}
            className={`bg-white p-4 rounded-xl border border-stone-100 shadow-sm transition ${editMode ? "cursor-grab border-emerald-200/80" : ""}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] bg-stone-100 px-2 py-1 rounded font-bold uppercase">{h.lop}</span>
              <span className="text-[10px] text-emerald-600 font-bold">{h.date} - {h.time}</span>
            </div>
            <h3 className="font-black text-stone-900">{h.name}</h3>
            <p className="text-xs text-stone-500">PH: {h.parent} | SĐT: {h.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}