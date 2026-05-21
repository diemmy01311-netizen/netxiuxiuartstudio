"use client";

import React, { useState, useEffect, useRef } from "react";
import { Download, Save, Edit3, ArrowLeft, Calendar, Users } from "lucide-react";
import Link from "next/link";
// Gọi trực tiếp từ thư mục lib/data.ts
import { getHocVien, saveHocVien, subscribeHocVien } from "../../lib/data"; 

const CAC_LOAI_LOP = ["Cơ bản", "Nhân vật", "Đa chất liệu", "Màu nước", "Acrylic"];
const CAC_THU = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export default function BuoiHocHomNayPage() {
  const [ngayHomNay, setNgayHomNay] = useState("");
  const [activeLop, setActiveLop] = useState("Cơ bản");
  const [isEditing, setIsEditing] = useState(false);
  const [hocVien, setHocVien] = useState<any[]>([]);
  const dragItemIndex = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setHocVien(await getHocVien());
      setNgayHomNay(CAC_THU[new Date().getDay()]);
    };
    fetchData();

    const channel = subscribeHocVien(() => {
      fetchData();
    });

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  const updateHocVien = async (newData: any) => {
    setHocVien(newData);
    await saveHocVien(newData);
  };

  const handleDragStart = (index: number) => {
    if (!isEditing) return;
    dragItemIndex.current = index;
  };

  const handleDrop = async (index: number) => {
    if (!isEditing || dragItemIndex.current === null) return;
    const sourceIndex = dragItemIndex.current;
    if (sourceIndex === index) return;

    const targetId = danhSachLoc[index]?.id;
    if (!targetId) return;

    const nextHocVien = [...hocVien];
    const sourceId = danhSachLoc[sourceIndex].id;
    const sourcePos = nextHocVien.findIndex((h: any) => h.id === sourceId);
    const [moved] = nextHocVien.splice(sourcePos, 1);
    const targetPos = nextHocVien.findIndex((h: any) => h.id === targetId);
    nextHocVien.splice(targetPos, 0, moved);
    await updateHocVien(nextHocVien);
    dragItemIndex.current = null;
  };

  const toggleSchedule = (id: number, day: string) => {
    const newData = hocVien.map((h: any) => {
      if (h.id !== id) return h;
      const newCaHoc = h.caHoc.includes(day) 
        ? h.caHoc.filter((d: string) => d !== day) 
        : [...h.caHoc, day];
      return { ...h, caHoc: newCaHoc };
    });
    updateHocVien(newData);
  };

  const danhSachLoc = hocVien.filter((h: any) => h.caHoc.includes(ngayHomNay) && h.lop === activeLop);

  const handleExport = () => {
    const csvHeader = "\uFEFF" + "Tên Bé,Phụ Huynh,SĐT,Lớp,Lịch Học\n";
    const csvRows = danhSachLoc.map(h => `${h.name},${h.parent},${h.phone},${h.lop},"${h.caHoc.join(", ")}"`).join("\n");
    const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Lop_${activeLop}_${ngayHomNay}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-4 md:p-10 font-sans text-stone-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-stone-500 font-bold text-xs hover:text-orange-600 transition">
            <ArrowLeft size={16} /> QUAY LẠI TRANG CHỦ
          </Link>
          <button onClick={() => setIsEditing(!isEditing)} className={`bg-white text-stone-700 px-4 py-2 rounded-xl text-xs font-bold border border-stone-200 transition ${isEditing ? "bg-stone-100" : "hover:bg-stone-50"}`}>
            {isEditing ? "Đang kéo thả" : "Bật kéo thả"}
          </button>
        </div>
        <div className="bg-orange-500 p-8 rounded-[40px] text-white shadow-2xl mb-10">
          <h1 className="text-4xl font-black">LỚP HỌC HÔM NAY: {ngayHomNay.toUpperCase()}</h1>
        </div>
        <div className="flex gap-2 mb-10 overflow-x-auto pb-4">
          {CAC_LOAI_LOP.map(lop => (
            <button key={lop} onClick={() => setActiveLop(lop)} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase ${activeLop === lop ? "bg-stone-900 text-white" : "bg-white text-stone-400"}`}>
              Lớp {lop}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {danhSachLoc.map((s: any, index: number) => (
            <div
              key={s.id}
              draggable={isEditing}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              className={`bg-white p-6 rounded-[35px] border border-stone-100 flex flex-col gap-4 transition ${isEditing ? "cursor-grab border-orange-200/80" : ""}`}
            >
              <div>
                <h3 className="font-black text-xl">{s.name}</h3>
                <p className="text-xs font-bold text-stone-400">PH: {s.parent} • {s.phone}</p>
                <p className="text-xs text-stone-400">Lớp: {s.lop} • Buổi đã học: {s.sessionsAttended ?? 0}</p>
                <p className="text-xs text-stone-400">Tiến trình: {s.progress || "Chưa cập nhật"}</p>
              </div>
              <div className="flex gap-1 flex-wrap">
                {CAC_THU.map(thu => (
                  <button key={thu} disabled={!isEditing} onClick={() => toggleSchedule(s.id, thu)} className={`w-8 h-8 rounded-lg text-[9px] font-black ${s.caHoc.includes(thu) ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-300"}`}>
                    {thu === "Chủ Nhật" ? "CN" : thu.replace("Thứ ", "")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}