import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Building, Users, UserCheck, Phone, Check } from 'lucide-react';
import { RombelItem } from '../../data/rombelData';
import { StudentClass } from '../../types';

interface AddEditRombelModalProps {
  isOpen: boolean;
  onClose: () => void;
  rombelToEdit?: RombelItem | null;
  onSave: (rombel: RombelItem) => void;
}

export const AddEditRombelModal: React.FC<AddEditRombelModalProps> = ({
  isOpen,
  onClose,
  rombelToEdit,
  onSave,
}) => {
  const [kodeRombel, setKodeRombel] = useState('1-A');
  const [tingkat, setTingkat] = useState<StudentClass>('Kelas 1');
  const [unit, setUnit] = useState<'MTs' | 'MA'>('MTs');
  const [gender, setGender] = useState<'Banin' | 'Banat'>('Banin');
  const [waliKelas, setWaliKelas] = useState('');
  const [waliKelasNip, setWaliKelasNip] = useState('');
  const [waliKelasHp, setWaliKelasHp] = useState('');
  const [ruangKelas, setRuangKelas] = useState('');
  const [gedung, setGedung] = useState('Gedung Timur Lt. 1');
  const [kapasitas, setKapasitas] = useState(30);
  const [ketuaKelas, setKetuaKelas] = useState('');

  useEffect(() => {
    if (rombelToEdit) {
      setKodeRombel(rombelToEdit.kodeRombel);
      setTingkat(rombelToEdit.tingkat);
      setUnit(rombelToEdit.unit);
      setGender(rombelToEdit.gender);
      setWaliKelas(rombelToEdit.waliKelas);
      setWaliKelasNip(rombelToEdit.waliKelasNip || '');
      setWaliKelasHp(rombelToEdit.waliKelasHp || '');
      setRuangKelas(rombelToEdit.ruangKelas);
      setGedung(rombelToEdit.gedung);
      setKapasitas(rombelToEdit.kapasitas);
      setKetuaKelas(rombelToEdit.ketuaKelas || '');
    } else {
      setKodeRombel('1-C');
      setTingkat('Kelas 1');
      setUnit('MTs');
      setGender('Banin');
      setWaliKelas('');
      setWaliKelasNip('');
      setWaliKelasHp('');
      setRuangKelas('Ruang Baru');
      setGedung('Gedung Timur Lt. 1');
      setKapasitas(30);
      setKetuaKelas('');
    }
  }, [rombelToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTingkatChange = (val: StudentClass) => {
    setTingkat(val);
    const num = parseInt(val.replace('Kelas ', ''), 10);
    setUnit(num <= 3 ? 'MTs' : 'MA');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waliKelas.trim()) {
      alert('Mohon isi nama Wali Kelas.');
      return;
    }

    const tingkatAngka = parseInt(tingkat.replace('Kelas ', ''), 10);
    const genderLabel = gender === 'Banin' ? 'Putra' : 'Putri';
    const namaRombel = `Kelas ${kodeRombel} (${unit} ${gender})`;

    const savedItem: RombelItem = {
      id: rombelToEdit ? rombelToEdit.id : `rmb-${Date.now()}`,
      kodeRombel,
      namaRombel,
      tingkat,
      tingkatAngka,
      unit,
      gender,
      genderLabel,
      waliKelas,
      waliKelasNip: waliKelasNip || '-',
      waliKelasHp: waliKelasHp || '0812-0000-0000',
      ruangKelas: ruangKelas || `Ruang ${kodeRombel}`,
      gedung,
      kapasitas: Number(kapasitas) || 30,
      jumlahSantri: rombelToEdit ? rombelToEdit.jumlahSantri : 0,
      totalTunggakan: rombelToEdit ? rombelToEdit.totalTunggakan : 0,
      persentaseLunas: rombelToEdit ? rombelToEdit.persentaseLunas : 100,
      ketuaKelas: ketuaKelas || '-',
    };

    onSave(savedItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-[#064E3B]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {rombelToEdit ? 'Edit Data Rombongan Belajar' : 'Tambah Rombel Baru'}
              </h2>
              <p className="text-xs text-slate-500">
                Konfigurasi kelas, wali kelas, ruang belajar, dan kapasitas santri
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Kelas
              </label>
              <select
                value={tingkat}
                onChange={(e) => handleTingkatChange(e.target.value as StudentClass)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              >
                <option value="Kelas 1">Kelas 1 (MTs Tingkat VII)</option>
                <option value="Kelas 2">Kelas 2 (MTs Tingkat VIII)</option>
                <option value="Kelas 3">Kelas 3 (MTs Tingkat IX)</option>
                <option value="Kelas 4">Kelas 4 (MA Tingkat X)</option>
                <option value="Kelas 5">Kelas 5 (MA Tingkat XI)</option>
                <option value="Kelas 6">Kelas 6 (MA Tingkat XII)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kode / Nama Rombel
              </label>
              <input
                type="text"
                value={kodeRombel}
                onChange={(e) => setKodeRombel(e.target.value)}
                placeholder="Contoh: 1-A, 2-B"
                required
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit Madrasah
              </label>
              <div className="px-3 py-2.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
                {unit === 'MTs' ? 'Madrasah Tsanawiyah (MTs)' : 'Madrasah Aliyah (MA)'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Rombel
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Banin' | 'Banat')}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              >
                <option value="Banin">Banin (Putra)</option>
                <option value="Banat">Banat (Putri)</option>
              </select>
            </div>
          </div>

          {/* Wali Kelas */}
          <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B]">
              <UserCheck className="w-4 h-4" /> Penugasan Wali Kelas
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Nama Wali Kelas (Gelar Lengkap)
              </label>
              <input
                type="text"
                value={waliKelas}
                onChange={(e) => setWaliKelas(e.target.value)}
                placeholder="Contoh: Ust. Zulkifli, S.Pd / Usth. Maryam Rahmah"
                required
                className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  NIP / ID Guru (Opsional)
                </label>
                <input
                  type="text"
                  value={waliKelasNip}
                  onChange={(e) => setWaliKelasNip(e.target.value)}
                  placeholder="19850412..."
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  No. WhatsApp / HP
                </label>
                <input
                  type="text"
                  value={waliKelasHp}
                  onChange={(e) => setWaliKelasHp(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Ruangan & Fasilitas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Ruang Belajar
              </label>
              <input
                type="text"
                value={ruangKelas}
                onChange={(e) => setRuangKelas(e.target.value)}
                placeholder="Ruang Abu Bakar As-Siddiq"
                required
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#064E3B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi Gedung / Lantai
              </label>
              <input
                type="text"
                value={gedung}
                onChange={(e) => setGedung(e.target.value)}
                placeholder="Gedung Timur Lt. 1"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daya Tampung (Kursi)
              </label>
              <input
                type="number"
                min="10"
                max="50"
                value={kapasitas}
                onChange={(e) => setKapasitas(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ketua Kelas (Opsional)
              </label>
              <input
                type="text"
                value={ketuaKelas}
                onChange={(e) => setKetuaKelas(e.target.value)}
                placeholder="Nama santri ketua kelas"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#064E3B] hover:bg-[#043327] rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" /> Simpan Rombel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
