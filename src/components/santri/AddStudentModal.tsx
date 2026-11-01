import React, { useState, useEffect } from 'react';
import { X, UserPlus, Sparkles, Check, Info, Trophy, Award, BookOpen, HeartHandshake } from 'lucide-react';
import { Student, StudentClass, StudentGender, StudentStatus, MealPackageType, ScholarshipType } from '../../types';
import { getClassUnit, MEAL_PACKAGES_INFO, SCHOLARSHIP_PACKAGES_INFO } from '../../data/studentsData';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStudent: (student: Omit<Student, 'id' | 'totalTagihan' | 'totalDibayar' | 'totalTunggakan'> & { id?: string }) => void;
  editingStudent?: Student | null;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSaveStudent,
  editingStudent,
}) => {
  const [nis, setNis] = useState('2026035');
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<StudentGender>('Laki-laki');
  const [kelas, setKelas] = useState<StudentClass>('Kelas 1');
  const [namaWali, setNamaWali] = useState('');
  const [noHpWali, setNoHpWali] = useState('');
  const [alamat, setAlamat] = useState('');
  const [status, setStatus] = useState<StudentStatus>('Aktif');
  const [paketMakan, setPaketMakan] = useState<MealPackageType>('Paket C');
  const [kategoriBeasiswa, setKategoriBeasiswa] = useState<ScholarshipType>('Reguler');
  const [catatanBeasiswa, setCatatanBeasiswa] = useState('');

  useEffect(() => {
    if (editingStudent) {
      setNis(editingStudent.nis);
      setNama(editingStudent.nama);
      setJenisKelamin(editingStudent.jenisKelamin);
      setKelas(editingStudent.kelas);
      setNamaWali(editingStudent.namaWali);
      setNoHpWali(editingStudent.noHpWali);
      setAlamat(editingStudent.alamat || '');
      setStatus(editingStudent.status);
      setPaketMakan(editingStudent.paketMakan);
      setKategoriBeasiswa(editingStudent.kategoriBeasiswa || 'Reguler');
      setCatatanBeasiswa(editingStudent.catatanBeasiswa || '');
    } else {
      setNis(`2026${Math.floor(100 + Math.random() * 900)}`);
      setNama('');
      setJenisKelamin('Laki-laki');
      setKelas('Kelas 1');
      setNamaWali('');
      setNoHpWali('');
      setAlamat('');
      setStatus('Aktif');
      setPaketMakan('Paket C');
      setKategoriBeasiswa('Reguler');
      setCatatanBeasiswa('');
    }
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const calculatedUnit = getClassUnit(kelas);
  const scholarshipInfo = SCHOLARSHIP_PACKAGES_INFO[kategoriBeasiswa] || SCHOLARSHIP_PACKAGES_INFO['Reguler'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nis.trim()) {
      alert('Mohon lengkapi data NIS dan Nama Lengkap santri.');
      return;
    }

    onSaveStudent({
      id: editingStudent?.id,
      nis,
      nama,
      jenisKelamin,
      kelas,
      unit: calculatedUnit,
      namaWali: namaWali || 'Wali Santri',
      noHpWali: noHpWali || '0812-0000-0000',
      alamat,
      status,
      paketMakan,
      kategoriBeasiswa,
      potonganSPP: scholarshipInfo.discountAmount,
      catatanBeasiswa: catatanBeasiswa.trim() || undefined,
      tanggalMasuk: editingStudent?.tanggalMasuk || '15 Juli 2026',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2E8F0] my-8 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#064E3B] flex items-center justify-center border border-emerald-100">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B]">
                {editingStudent ? 'Ubah Data Santri' : 'Tambah Data Santri'}
              </h3>
              <p className="text-xs text-[#64748B]">
                Pendaftaran, administrasi data induk & pengaturan kategori SPP / beasiswa santri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form with Scrollable Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-6 text-xs overflow-y-auto pr-1 flex-1">
          {/* SECTION 1: Informasi Utama */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider pb-1 border-b border-[#E2E8F0]">
              <span>1. Informasi Utama Santri</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Nomor Induk Santri (NIS) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  placeholder="Contoh: 2026001"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-mono font-bold text-[#1E293B] focus:bg-white focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Nama Lengkap Santri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Muhammad Rizky"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-medium text-[#1E293B] focus:bg-white focus:ring-2 focus:ring-[#064E3B]/20 focus:border-[#064E3B] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as StudentGender)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#064E3B] outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value as StudentClass)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-medium text-[#1E293B] focus:bg-white focus:border-[#064E3B] outline-none"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Unit Lembaga (Otomatis)
                </label>
                <div className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg p-2.5 text-xs font-bold text-[#064E3B] flex items-center justify-between">
                  <span>{calculatedUnit}</span>
                  <span className="text-[10px] text-[#64748B] font-normal">
                    {calculatedUnit === 'MTs' ? 'Kelas 1–3' : 'Kelas 4–6'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Kategori SPP & Beasiswa Prestasi */}
          <div className="space-y-3 p-3.5 rounded-xl bg-purple-50/40 border border-purple-200">
            <div className="flex items-center justify-between pb-1.5 border-b border-purple-200/60">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-purple-700" />
                <span>2. Kategori SPP & Potongan Beasiswa</span>
              </div>
              <span className="text-[11px] font-bold text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-200">
                {scholarshipInfo.discountAmount > 0
                  ? `Potongan SPP: ${scholarshipInfo.discountFormatted}`
                  : 'SPP Penuh (Rp500.000 / bln)'}
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Pilih Kategori SPP / Beasiswa Santri <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  [
                    'Reguler',
                    'Beasiswa Prestasi (100%)',
                    'Beasiswa Prestasi (50%)',
                    'Beasiswa Tahfidz',
                    'Beasiswa Yatim / Dhuafa',
                  ] as ScholarshipType[]
                ).map((sch) => {
                  const info = SCHOLARSHIP_PACKAGES_INFO[sch];
                  const isSelected = kategoriBeasiswa === sch;

                  return (
                    <div
                      key={sch}
                      onClick={() => setKategoriBeasiswa(sch)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'border-purple-500 bg-white ring-2 ring-purple-400 shadow-xs'
                          : 'border-purple-100 bg-white/70 hover:bg-white hover:border-purple-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-600 bg-purple-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#1E293B]">
                            {sch}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-purple-700">
                            {info.discountFormatted}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] mt-0.5 leading-snug">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kolom Catatan / Keterangan Beasiswa jika memilih beasiswa */}
            {kategoriBeasiswa !== 'Reguler' && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label className="block font-bold text-[#334155] mb-1">
                  Keterangan Prestasi / Catatan Beasiswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={catatanBeasiswa}
                  onChange={(e) => setCatatanBeasiswa(e.target.value)}
                  placeholder="Contoh: Juara 1 MQK Tingkat Provinsi Riau / Juara 1 Olimpiade Matematika Terintegrasi"
                  className="w-full bg-white border border-purple-300 rounded-lg p-2.5 text-xs text-[#1E293B] focus:ring-2 focus:ring-purple-400 focus:border-purple-600 outline-none"
                />
                <p className="text-[10px] text-purple-700 mt-1">
                  Catatan ini akan tercantum di rincian tagihan SPP dan berkas slip pembayaran santri.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 3: Informasi Wali */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider pb-1 border-b border-[#E2E8F0]">
              <span>3. Informasi Orang Tua / Wali</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={namaWali}
                  onChange={(e) => setNamaWali(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:bg-white focus:border-[#064E3B] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#334155] mb-1">
                  Nomor HP / WhatsApp Wali
                </label>
                <input
                  type="text"
                  value={noHpWali}
                  onChange={(e) => setNoHpWali(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:bg-white focus:border-[#064E3B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1">
                Alamat Domisili Lengkap
              </label>
              <textarea
                rows={2}
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                placeholder="Contoh: Dusun Sukamaju, Mahato KM 24, Kec. Tambusai Utara, Rokan Hulu"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5 text-xs text-[#1E293B] focus:bg-white focus:border-[#064E3B] outline-none resize-none"
              />
            </div>
          </div>

          {/* SECTION 4: Status & Paket Makan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B] uppercase tracking-wider pb-1 border-b border-[#E2E8F0]">
              <span>4. Status Santri & Paket Makan</span>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Status Keaktifan
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Aktif', 'Lulus', 'Pindah'] as StudentStatus[]).map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setStatus(st)}
                    className={`py-2 px-3 rounded-lg border text-center font-bold text-xs transition ${
                      status === st
                        ? 'border-[#064E3B] bg-emerald-50 text-[#064E3B] ring-1 ring-[#064E3B]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:bg-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#334155] mb-1.5">
                Pilihan Paket Konsumsi / Makan (Dapur Pesantren)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Paket A', 'Paket B', 'Paket C'] as MealPackageType[]).map((pkg) => {
                  const info = MEAL_PACKAGES_INFO[pkg];
                  const isSelected = paketMakan === pkg;

                  return (
                    <div
                      key={pkg}
                      onClick={() => setPaketMakan(pkg)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#064E3B] bg-emerald-50/50 shadow-xs ring-1 ring-[#064E3B]'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-[#1E293B]">
                          {info.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#064E3B] bg-[#064E3B] text-white'
                              : 'border-[#CBD5E1]'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#64748B] mb-2 leading-tight">
                        {info.label}
                      </p>
                      <div className="pt-2 border-t border-[#E2E8F0]/60">
                        <span className="font-extrabold text-[#064E3B] text-xs">
                          {info.priceFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#064E3B] hover:bg-emerald-900 rounded-lg shadow-xs transition"
            >
              {editingStudent ? 'Perbarui Data Santri' : 'Simpan Data Santri'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

