import { supabase } from './supabase';

export const DANH_SACH_LOP = ["Cơ bản", "Nhân vật", "Đa chất liệu", "Màu nước", "Acrylic"];

export const getSiteData = () => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem("netxiuxiu_data");
  return data ? JSON.parse(data) : null;
};

export const saveSiteData = (data: any) => {
  localStorage.setItem("netxiuxiu_data", JSON.stringify(data));
};

export interface HocVien {
  id: string;
  full_name: string;
  phone: string;
  class_name: string;
  create_at: string;
  age: number;
  tuition_date: string;
  parent_name: string;
  social_url: string;
  caHoc: string[];
  schedule_time: string;
  progress: string;
  notes: string;
  sessionsAttended: number;
}

export const getHocVien = async () => {
  const { data, error } = await supabase.from('hoc_vien').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Supabase getHocVien error:', error.message);
    return [];
  }
  return data || [];
};

export const saveHocVien = async (data: any[]) => {
  const { error } = await supabase.from('hoc_vien').upsert(data, { onConflict: 'id' });
  if (error) {
    console.error('Supabase saveHocVien error:', error.message);
  }
  return data;
};

export const addHocVien = async (newHocVien: any) => {
  const { data, error } = await supabase.from('hoc_vien').insert([newHocVien]);
  if (error) {
    console.error('Supabase addHocVien error:', error.message);
    return null;
  }
  return data?.[0] || null;
};

export const getHocThu = async () => {
  const { data, error } = await supabase.from('hoc_thu').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Supabase getHocThu error:', error.message);
    return [];
  }
  return data || [];
};

export const saveHocThu = async (data: any[]) => {
  const { error } = await supabase.from('hoc_thu').upsert(data, { onConflict: 'id' });
  if (error) {
    console.error('Supabase saveHocThu error:', error.message);
  }
  return data;
};

export const addHocThu = async (newHocThu: any) => {
  const { data, error } = await supabase.from('hoc_thu').insert([newHocThu]);
  if (error) {
    console.error('Supabase addHocThu error:', error.message);
    return null;
  }
  return data?.[0] || null;
};

export const subscribeHocVien = (onEvent: () => void) =>
  supabase
    .channel('realtime-hoc-vien')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hoc_vien' }, () => {
      onEvent();
    })
    .subscribe();

export const subscribeHocThu = (onEvent: () => void) =>
  supabase
    .channel('realtime-hoc-thu')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'hoc_thu' }, () => {
      onEvent();
    })
    .subscribe();
