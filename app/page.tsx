"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Plus, User, Calendar, GraduationCap } from "lucide-react";
import { getHocVien, getHocThu, getSiteData, saveSiteData } from "../lib/data";

interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  room: string;
  students: string[];
}

interface RegistrationItem {
  id: number;
  name: string;
  className: string;
  createdAt: string;
}

export default function NetXiuXiuAdvanced() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [siteData, setSiteData] = useState({
    logoName: "Nét Xíu Xiu Art",
    heroTitle: "Nơi Khơi Nguồn Sáng Tạo Nhỏ",
    heroSub: "Không gian ươm mầm nghệ thuật cho mọi lứa tuổi.",
    stats: { total: 42, today: 5, trial: 3 },
    classes: [
      { id: 1, name: "Lớp Cơ Bản", teacher: "Cô Mai", room: "101", students: ["Bé Mây", "Bé Na"] },
      { id: 2, name: "Lớp Màu Nước", teacher: "Thầy Tùng", room: "202", students: ["Bé Sóc", "Bé Gạo"] },
    ] as ClassItem[],
    registrations: [] as RegistrationItem[], 
  });

  const [registerName, setRegisterName] = useState("");
  const [registerClass, setRegisterClass] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [hocVien, setHocVien] = useState<any[]>([]);
  const [hocThu, setHocThu] = useState<any[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const CAC_THU = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  useEffect(() => {
    const saved = getSiteData();
    if (saved) {
      setSiteData(saved);
    }

    setHocVien(getHocVien());
    setHocThu(getHocThu());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      saveSiteData(siteData);
    }
  }, [siteData]);

  const handleDragStartClass = (index: number) => {
    if (!editMode) return;
    dragIndex.current = index;
  };

  const handleDropClass = (index: number) => {
    if (!editMode || dragIndex.current === null) return;
    const from = dragIndex.current;
    if (from === index) return;

    const nextClasses = [...siteData.classes];
    const [moved] = nextClasses.splice(from, 1);
    nextClasses.splice(index, 0, moved);

    setSiteData(prev => ({
      ...prev,
      classes: nextClasses,
    }));
    dragIndex.current = null;
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registerName.trim() || !registerClass.trim()) return alert("Vui lòng điền đủ thông tin.");

    const newReg: RegistrationItem = {
      id: Date.now(),
      name: registerName.trim(),
      className: registerClass,
      createdAt: new Date().toISOString()
    };

    setSiteData(prev => ({
      ...prev,
      registrations: [...prev.registrations, newReg],
      stats: { ...prev.stats, trial: prev.stats.trial + 1 }
    }));

    setRegisterName("");
    setRegisterClass("");
    alert("Đăng ký học thử thành công!");
  };

  const addNewClass = () => {
    const name = prompt("Nhập tên lớp mới:");
    if (!name) return;
    setSiteData(prev => ({
      ...prev,
      classes: [...prev.classes, { id: Date.now(), name, teacher: "Chưa phân công", room: "TBD", students: [] }]
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-800 p-4 md:p-8">
      {/* BAR ADMIN */}
      <div className="bg-amber-950 text-amber-100 p-3 flex justify-between items-center rounded-2xl max-w-7xl mx-auto mb-6 px-6 shadow-sm border border-amber-900/50">
        <span className="text-xs font-mono">{isAdmin ? "🔧 Chế độ chỉnh sửa" : "🌐 Chế độ xem khách"}</span>
        <div className="flex gap-2">
          <button onClick={() => setIsAdmin(!isAdmin)} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1 rounded-full text-xs font-bold transition-all">
            {isAdmin ? "Thoát Sửa" : "Sửa Giao Diện"}
          </button>
          <button onClick={() => setEditMode(!editMode)} className={`bg-white text-amber-950 px-4 py-1 rounded-full text-xs font-bold transition-all border border-amber-200 ${editMode ? "shadow-inner" : "hover:bg-amber-50"}`}>
            {editMode ? "Đang kéo thả" : "Bật kéo thả"}
          </button>
        </div>
      </div>

      {/* HEADER & MENU */}
      <header className="max-w-7xl mx-auto bg-white rounded-3xl p-6 mb-8 border border-amber-100 shadow-xs flex flex-col sm:flex-row justify-between items-center px-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black shadow-md rotate-3">N</div>
          <h1 className="text-xl font-black text-amber-950 uppercase italic tracking-tight">{siteData.logoName}</h1>
        </div>
        
        <nav className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-stone-600">
          <Link href="/buoi-hoc-hom-nay" className="hover:text-orange-600 transition-colors">
            Buổi học hôm nay
          </Link>
          <Link href="/danh-sach-hoc-vien" className="hover:text-orange-600 transition-colors">
            Danh sách học viên
          </Link>
          <Link href="/lich-hoc" className="hover:text-orange-600 transition-colors">
            Lịch học thử
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* HERO SECTION */}
        <section className="bg-gradient-to-br from-amber-500 via-orange-600 to-amber-950 rounded-[32px] p-8 md:p-14 text-white shadow-xl relative overflow-hidden border-b-8 border-amber-900/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-amber-400/30 text-amber-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-xs">
              Art Studio
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight drop-shadow-xs">
              {siteData.heroTitle}
            </h2>
            <p className="text-amber-100/90 text-sm md:text-base font-medium leading-relaxed">
              {siteData.heroSub}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-orange-500/30 rounded-full blur-2xl"></div>
        </section>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-amber-100/60 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">🎯</div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tổng học viên</p>
              <p className="text-2xl font-black text-stone-800 mt-0.5">{hydrated ? hocVien.length : siteData.stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-amber-100/60 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">📝</div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Lớp học hôm nay</p>
              <p className="text-2xl font-black text-stone-800 mt-0.5">{hydrated ? hocVien.filter(h => h.caHoc?.includes(CAC_THU[new Date().getDay()])).length : siteData.stats.today}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-amber-100/60 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">🎨</div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Lịch học thử</p>
              <p className="text-2xl font-black text-stone-800 mt-0.5">{hydrated ? hocThu.length : siteData.stats.trial}</p>
            </div>
          </div>
        </div>

        {/* LIST CLASSES */}
        <section id="danh-sach-lop" className="space-y-6 pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-stone-800 uppercase italic tracking-tight">Danh Sách Lớp Học</h3>
              <p className="text-stone-400 text-xs font-medium">Nơi hiển thị thông tin chi tiết từng lớp</p>
            </div>
            {isAdmin && (
              <button onClick={addNewClass} className="bg-amber-950 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-orange-600 transition-colors">
                <Plus size={14} /> Thêm Lớp
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteData.classes.map((cls, index) => (
              <div
                key={cls.id}
                draggable={editMode}
                onDragStart={() => handleDragStartClass(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDropClass(index)}
                className={`bg-white p-6 rounded-3xl border border-amber-100/50 shadow-xs space-y-4 transition-all ${editMode ? "cursor-grab border-orange-300/80" : "hover:border-orange-300"}`}
              >
                <div className={`flex items-center justify-between ${editMode ? "mb-3 text-orange-500" : ""}`}>
                  <h4 className="text-lg font-black text-amber-950 uppercase italic">{cls.name}</h4>
                  {editMode && <span className="text-xs font-bold uppercase">Kéo thả</span>}
                </div>
                <div className="text-xs text-stone-500 space-y-1">
                  <p>Giáo viên: <strong className="text-stone-700">{cls.teacher}</strong></p>
                  <p>Phòng học: <strong className="text-orange-600">{cls.room}</strong></p>
                </div>
                <div className="bg-amber-50/40 p-3 rounded-xl flex flex-wrap gap-2 border border-amber-100/30">
                  {cls.students.map((st, i) => (
                    <span key={i} className="bg-white px-3 py-1 rounded-lg text-xs font-bold border border-amber-100/50 shadow-2xs text-stone-600 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REGISTRATION FORM */}
        <section className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-md">
          <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black uppercase italic">Đăng Ký Học Trải Nghiệm</h3>
            <p className="text-amber-100 text-xs font-medium">Bé tham gia lớp học thử miễn phí cùng các thầy cô tại studio.</p>
          </div>
          <form onSubmit={handleRegisterSubmit} className="w-full md:w-auto flex-1 bg-white p-6 rounded-2xl space-y-4 text-slate-800 shadow-sm">
            <input value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="Tên của bé..." className="w-full p-3 bg-stone-50 rounded-xl outline-none font-bold border border-stone-100 text-xs focus:border-orange-400 focus:bg-white transition-all" />
            <select value={registerClass} onChange={(e) => setRegisterClass(e.target.value)} className="w-full p-3 bg-stone-50 rounded-xl outline-none font-bold border border-stone-100 text-xs text-stone-600">
              <option value="">Chọn lớp trải nghiệm...</option>
              {siteData.classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <button className="w-full bg-orange-500 text-white font-black py-3 rounded-xl hover:bg-amber-950 transition-colors uppercase text-xs tracking-wider shadow-sm">Gửi Đăng Ký</button>
          </form>
        </section>
      </main>

      <footer className="py-8 text-center mt-12 border-t border-amber-100/50">
        <p className="text-stone-400 font-bold text-[10px] tracking-widest uppercase">© 2026 {siteData.logoName} • Art For Everyone</p>
      </footer>
    </div>
  );
}