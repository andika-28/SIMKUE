import React from 'react';
import {
  User,
  Utensils,
  Home,
  Phone,
  Edit,
  GraduationCap,
  Calendar,
  Award,
  ShieldCheck,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { Student } from '../../../types';
import { MEAL_PACKAGES_INFO, SCHOLARSHIP_PACKAGES_INFO } from '../../../data/studentsData';

interface TabProfilProps {
  student: Student;
  onEditProfile: () => void;
}

export const TabProfil: React.FC<TabProfilProps> = ({ student, onEditProfile }) => {
  const mealInfo = MEAL_PACKAGES_INFO[student.paketMakan] || MEAL_PACKAGES_INFO['Paket C'];
  const scholarshipInfo = student.kategoriBeasiswa
    ? SCHOLARSHIP_PACKAGES_INFO[student.kategoriBeasiswa]
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-4xl">
      
      {/* 1. SECTION: INFORMASI SANTRI */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#064E3B]" />
            <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
              Informasi Santri
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#064E3B] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {student.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              NIS (Nomor Induk Santri)
            </span>
            <p className="font-mono text-sm font-bold text-[#1E293B] mt-1">
              {student.nis}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Nama Lengkap
            </span>
            <p className="text-sm font-bold text-[#1E293B] mt-1">
              {student.nama}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Jenis Kelamin
            </span>
            <p className="text-sm font-medium text-[#334155] mt-1">
              {student.jenisKelamin}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Jenjang / Unit
            </span>
            <p className="text-sm font-semibold text-[#334155] mt-1">
              {student.unit} (Madrasah Tsanawiyah)
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Kelas
            </span>
            <p className="text-sm font-semibold text-[#334155] mt-1">
              {student.kelas}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Kategori SPP / Beasiswa
            </span>
            <p className="text-sm font-semibold text-purple-700 mt-1">
              {student.kategoriBeasiswa || 'Reguler'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. SECTION: PAKET MAKAN */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 mb-5">
          <Utensils className="w-4 h-4 text-[#064E3B]" />
          <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Paket Makan & Dapur Santri
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Pilihan Paket
            </span>
            <p className="text-sm font-bold text-[#064E3B] mt-1">
              {student.paketMakan}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Keterangan Menu
            </span>
            <p className="text-sm font-medium text-[#334155] mt-1">
              {mealInfo.label}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Nominal Tarif
            </span>
            <p className="text-sm font-mono font-bold text-[#064E3B] mt-1">
              {mealInfo.priceFormatted}
            </p>
          </div>
        </div>

        <p className="text-xs text-[#64748B] mt-4 pt-4 border-t border-[#E2E8F0]">
          {mealInfo.description}
        </p>
      </div>

      {/* 3. SECTION: INFORMASI WALI */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 mb-5">
          <Home className="w-4 h-4 text-[#064E3B]" />
          <h3 className="text-sm font-bold text-[#1E293B] uppercase tracking-wider">
            Informasi Wali & Kontak
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Nama Wali
            </span>
            <p className="text-sm font-bold text-[#1E293B] mt-1">
              {student.namaWali}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Nomor HP Wali (WhatsApp)
            </span>
            <a
              href={`https://wa.me/${student.noHpWali.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-mono font-bold text-[#064E3B] hover:underline flex items-center gap-1.5 mt-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{student.noHpWali}</span>
            </a>
          </div>

          <div className="sm:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Alamat Domisili
            </span>
            <p className="text-xs text-[#334155] mt-1 leading-relaxed flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0 mt-0.5" />
              <span>{student.alamat || 'Mahato, Rokan Hulu, Riau'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BUTTON */}
      <div className="flex items-center justify-end">
        <button
          id="btn-edit-profil-bottom"
          onClick={onEditProfile}
          className="px-4 py-2.5 rounded-lg bg-[#064E3B] hover:bg-emerald-900 text-white font-semibold text-xs flex items-center gap-2 transition shadow-xs active:scale-98"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profil</span>
        </button>
      </div>

    </div>
  );
};
