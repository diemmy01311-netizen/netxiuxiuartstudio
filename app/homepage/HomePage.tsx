"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, BookOpen, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function NetXiuXiuDashboard() {
  const router = useRouter();

  // Dữ liệu mẫu khớp hoàn toàn với bản thiết kế UI của bạn
  const [attendance, setAttendance] = useState([
    { id: 1, name: "Bé Mây", class: "Lớp Vẽ Thiếu Nhi", status: "Có mặt", statusColor: "bg-blue-100 text-blue-600" },
    { id: 2, name: "Bé Sóc", class: "Lớp Vẽ Thiếu Nhi", status: "Nghỉ phép", statusColor: "bg-orange-100 text-orange-600" },
    { id: 3, name: "Bé Na", class: "Lớp Vẽ Thiếu Nhi", status: "Có mặt", statusColor: "bg-blue-100 text-blue-600" },
    { id: 4, name: "Bé Gạo", class: "Lớp Vẽ Thiếu Nhi", status: "Chờ xác nhận", statusColor: "bg-slate-100 text-slate-600" },
  ]);

  const schedule = [
    { time: "09:00", name: "Vẽ sáng tạo thiếu nhi", room: "Phòng Studio A" },
    { time: "14:00", name: "Watercolor cơ bản", room: "Phòng Studio A" },
    { time: "18:00", name: "Sketch nâng cao", room: "Phòng Studio A" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans p-4 md:p-8">
      {/* HEADER NAV */}
      <header className="max-w-7xl mx-auto bg-white rounded-3xl p-4 mb-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center px-8 gap-4">
        <div>
          <h1 className="text-xl font-black text-blue-900 tracking-tight uppercase">NÉT XÍU XIU Art Studio</h1>
          <p className="text-xs text-slate-400 font-medium">Quản lý lớp học mỹ thuật</p>
        </div>
        <nav className="flex items-center gap-6 text-sm font-bold text-slate-500">
          <button className="text-blue-600 font-extrabold">Buổi Học Hôm Nay</button>
          <button onClick={() => router.push("/lich-hoc")} className="hover:text-blue-600 transition-colors">Đăng Ký Học Thử</button>
          <button onClick={() => router.push("/lich-hoc")} className="hover:text-blue-600 transition-colors">Danh Sách Lớp</button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng học viên</p>
            <p className="text-4xl font-black text-blue-950">42</p>
            <p className="text-xs font-bold text-blue-500">+4 học viên mới tuần này</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lớp học hôm nay</p>
            <p className="text-4xl font-black text-blue-950">5</p>
            <p className="text-xs font-bold text-orange-500">2 lớp buổi tối</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Học thử</p>
            <p className="text-4xl font-black text-blue-950">3</p>
            <p className="text-xs font-bold text-slate-500">Có lịch học thử chiều nay</p>
          </div>
        </div>

        {/* TWO COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ĐIỂM DANH */}
          <section className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-blue-950">Điểm danh hôm nay</h2>
            </div>
            <div className="space-y-3">
              {attendance.map((student) => (
                <div key={student.id} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <div>
                    <p className="font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{student.class}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black ${student.statusColor}`}>
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* LỊCH HỌC HÔM NAY */}
          <section className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-blue-950">Lịch học hôm nay</h2>
            </div>
            <div className="space-y-3">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <div className="bg-blue-50 text-blue-600 font-black px-3 py-1.5 rounded-xl text-sm">
                    {item.time}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.room}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}