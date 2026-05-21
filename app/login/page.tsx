"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data?.session) {
      setMessage("Đăng nhập thành công! Đang chuyển về trang chủ...");
      router.push("/");
    } else {
      setMessage("Đang gửi yêu cầu đăng nhập. Vui lòng kiểm tra email nếu cần.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
        <h1 className="text-2xl font-black text-slate-900 mb-4">Đăng nhập</h1>
        <p className="text-sm text-slate-500 mb-6">Sử dụng Supabase Auth để đăng nhập vào hệ thống.</p>

        {message && <div className="mb-4 rounded-xl bg-amber-100 border border-amber-200 px-4 py-3 text-sm text-amber-900">{message}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              placeholder="email@example.com"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Mật khẩu
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:bg-white"
              placeholder="Mật khẩu"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 text-white py-3 text-sm font-bold hover:bg-slate-800 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
