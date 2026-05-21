// lib/data.ts

// --- Cấu hình chung cho toàn bộ hệ thống ---
export const DANH_SACH_LOP = ["Cơ bản", "Nhân vật", "Đa chất liệu", "Màu nước", "Acrylic"];

// --- Dữ liệu và cấu hình trang chủ chung ---
export const getSiteData = () => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem("netxiuxiu_data");
  return data ? JSON.parse(data) : null;
};

export const saveSiteData = (data: any) => {
  localStorage.setItem("netxiuxiu_data", JSON.stringify(data));
};

// --- Dữ liệu Học viên chính thức ---
export const getHocVien = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem("hoc_vien_data");
  return data ? JSON.parse(data) : [
    { id: 1, name: "Bé Mây", parent: "Chị Linh", phone: "0901234567", lop: "Cơ bản", caHoc: ["Thứ 2", "Thứ 4"] },
    { id: 2, name: "Bé Na", parent: "Anh Hải", phone: "0912345678", lop: "Lớp Vẽ Thiếu Nhi", caHoc: ["Thứ 3", "Thứ 5"] }
  ];
};

export const saveHocVien = (data: any) => {
  localStorage.setItem("hoc_vien_data", JSON.stringify(data));
};

// --- Dữ liệu Học thử ---
export const getHocThu = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem("hoc_thu_data");
  return data ? JSON.parse(data) : [
    { 
      id: 1, 
      name: "Bé An", 
      age: 5, 
      parent: "Chị Lan", 
      phone: "0912345678", 
      status: "Chờ xác nhận", 
      lop: "Cơ bản", 
      date: "20/05/2026", 
      time: "17:00" 
    }
  ];
};

export const saveHocThu = (data: any) => {
  localStorage.setItem("hoc_thu_data", JSON.stringify(data));
};

// --- Hàm thêm mới học thử (Dùng cho nút Tạo lịch) ---
export const addHocThu = (newHocThu: any) => {
  const currentData = getHocThu();
  const newData = [
    ...currentData, 
    { 
      id: Date.now(), // Tạo ID duy nhất theo thời gian
      ...newHocThu, 
      status: "Chờ xác nhận" 
    }
  ];
  saveHocThu(newData);
  return newData;
};