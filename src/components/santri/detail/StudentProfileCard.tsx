import React from 'react';
import {
  User,
  Phone,
  Edit,
  Utensils,
  GraduationCap,
  Building,
  CheckCircle2,
  Trophy,
  Award,
  ChevronDown,
} from 'lucide-react';
import { Student } from '../../../types';
import { MEAL_PACKAGES_INFO } from '../../../data/studentsData';

interface StudentProfileCardProps {
  student: Student;
  onEditStudent: () => void;
  allStudents?: Student[];
  onSelectAnotherStudent?: (student: Student) => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  onEditStudent,
  allStudents = [],
  onSelectAnotherStudent,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const mealInfo = MEAL_PACKAGES_INFO[student.paketMakan] || MEAL_PACKAGES_INFO['Paket C'];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs relative">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* LEFT SIDE: Avatar + Student Identification */}
        <div className="flex items-center gap-4 lg:w-4/12">
          {/* Circular avatar placeholder */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xl font-bold border-2 border-emerald-100 shadow-xs">
              {student.nama
                .split(' ')
                .slice(0, 2)
                .map((n) => n[0])
                .join('')}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-[#1E293B] tracking-tight truncate">
                {student.nama}
              </h1>

              {/* Status Badge: ● Aktif */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#064E3B] border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {student.status}
              </span>
            </div>

            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
              <span>NIS: <strong className="font-mono text-[#1E293B]">{student.nis}</strong></span>
              {student.kategoriBeasiswa && student.kategoriBeasiswa !== 'Reguler' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  <Trophy className="w-2.5 h-2.5" />
                  {student.kategoriBeasiswa}
                </span>
              )}
            </p>

            {/* Compact details below */}
            <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1.5">
              <span className="font-medium text-[#334155]">{student.kelas} {student.unit}</span>
              <span className="text-[#CBD5E1]">•</span>
              <span>Jenis Kelamin: <strong className="text-[#334155] font-normal">{student.jenisKelamin}</strong></span>
            </div>
          </div>
        </div>

        {/* CENTER AREA: Student Academic & Meal Info */}
        <div className="grid grid-cols-3 gap-4 lg:w-4/12 border-y lg:border-y-0 lg:border-x border-[#E2E8F0] py-4 lg:py-0 lg:px-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Unit
            </span>
            <p className="text-sm font-bold text-[#1E293B] mt-0.5">
              {student.unit}
            </p>
            <p className="text-[11px] text-[#64748B]">Tingkat Pertama</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Kelas
            </span>
            <p className="text-sm font-bold text-[#1E293B] mt-0.5">
              {student.kelas}
            </p>
            <p className="text-[11px] text-[#64748B]">Rombel A</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Paket Makan
            </span>
            <p className="text-sm font-bold text-[#064E3B] mt-0.5">
              {student.paketMakan}
            </p>
            <p className="text-[10px] text-[#64748B] leading-tight">
              {mealInfo.label}
            </p>
            <p className="text-[10px] font-semibold text-[#064E3B] mt-0.5">
              {mealInfo.priceFormatted}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Guardian Info + Action Button */}
        <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-4/12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
              Informasi Wali
            </span>
            <p className="text-sm font-bold text-[#1E293B] mt-0.5">
              {student.namaWali}
            </p>
            <a
              href={`https://wa.me/${student.noHpWali.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-[#064E3B] hover:underline flex items-center gap-1.5 mt-0.5 group"
            >
              <Phone className="w-3.5 h-3.5 text-[#064E3B] group-hover:scale-110 transition" />
              <span>{student.noHpWali}</span>
            </a>
          </div>

          {/* Top-Right Outlined Button */}
          <div className="flex flex-col items-end gap-2">
            <button
              id="btn-edit-student-profile"
              onClick={onEditStudent}
              className="px-3.5 py-2 rounded-lg border border-[#064E3B] text-[#064E3B] hover:bg-emerald-50 text-xs font-semibold flex items-center gap-2 transition active:scale-98"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Data Santri</span>
            </button>

            {/* Optional student selector */}
            {allStudents.length > 1 && onSelectAnotherStudent && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="text-[11px] text-[#64748B] hover:text-[#064E3B] flex items-center gap-1 underline transition"
                >
                  <span>Ganti Santri</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-1.5 z-40 max-h-56 overflow-y-auto">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      Pilih Profil Santri
                    </div>
                    {allStudents.map((std) => (
                      <button
                        key={std.id}
                        onClick={() => {
                          onSelectAnotherStudent(std);
                          setShowDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F8FAFC] transition ${
                          std.id === student.id ? 'bg-emerald-50 text-[#064E3B] font-semibold' : 'text-[#334155]'
                        }`}
                      >
                        <span className="truncate">{std.nama}</span>
                        <span className="font-mono text-[10px] text-[#94A3B8]">{std.nis}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
