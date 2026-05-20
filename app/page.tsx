"use client";

import React, { useState } from "react";

export default function HomePage() {
  // Dữ liệu giả lập cho Học viên (Dùng để hiển thị trong thông tin lớp)
  const studentsData = {
    "Cơ Bản": ["Nguyễn Văn A", "Trần Thị B", "Lê Hoàng C"],
    "Nhân Vật": ["Phan Minh D", "Vũ Hải E"],
    "Đa Chất Liệu": ["Hoàng An G", "Đặng Bình H", "Bùi Cường I"],
    "Acrylic": ["Ngô Diệu K", "Lý Mai L"],
    "Màu Nước": ["Trịnh Nam M", "Phạm Oanh N", "Đỗ Phúc P"]
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      
      {/* --- THANH MENU & LOGO --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
              X
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-amber-700 block">NÉT XÍU XIU</span>
              <span className="text-xs text-stone-400 tracking-widest uppercase block -mt-1">Art Studio</span>
            </div>
          </div>

          {/* Menu Điều Hướng */}
          <nav className="hidden md:flex space-x-8 font-medium text-stone-600">
            <a href="#lich-hoc" className="hover:text-amber-600 transition-colors">Buổi Học Hôm Nay</a>
            <a href="#hoc-thu" className="hover:text-amber-600 transition-colors">Đăng Ký Học Thử</a>
            <a href="#khoa-hoc" className="hover:text-amber-600 transition-colors">Danh Sách Lớp</a>
          </nav>

          {/* Nút Call to Action */}
          <div>
            <a href="#hoc-thu" className="bg-amber-600 hover:bg-amber-700