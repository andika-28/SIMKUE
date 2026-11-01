import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Upload,
  CheckCircle2,
  Eye,
  FileText,
  Sparkles,
  Phone,
  Mail,
  Globe,
  UserCheck,
  Shield,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { InstitutionIdentity } from '../../types';
import { saveStoredInstitutionIdentity } from '../../utils/institutionStorage';

interface SectionIdentitasPesantrenProps {
  identity: InstitutionIdentity;
  onUpdateIdentity: (updated: Partial<InstitutionIdentity>) => void;
  onShowToast: (msg: string) => void;
}

export const SectionIdentitasPesantren: React.FC<SectionIdentitasPesantrenProps> = ({
  identity,
  onUpdateIdentity,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<InstitutionIdentity>(identity);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData when identity prop changes
  useEffect(() => {
    setFormData(identity);
  }, [identity]);

  const handleChange = (field: keyof InstitutionIdentity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateIdentity(formData);
    saveStoredInstitutionIdentity(formData);
    onShowToast('Identitas Pesantren & logo resmi berhasil disimpan.');
  };

  const processImageFile = (file: File) => {
    setUploadError(null);

    // 1. Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      const errorMsg = 'Format file tidak didukung. Harap pilih gambar dengan format PNG, JPG, JPEG, WEBP, atau SVG.';
      setUploadError(errorMsg);
      onShowToast(errorMsg);
      return;
    }

    // 2. Validate file size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = 'Ukuran berkas logo terlalu besar (maksimal 5 MB). Harap perkecil resolusi atau kompres gambar.';
      setUploadError(errorMsg);
      onShowToast(errorMsg);
      return;
    }

    setIsUploadingLogo(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const updated = { ...formData, logoUrl: dataUrl };
        setFormData(updated);
        onUpdateIdentity(updated);
        saveStoredInstitutionIdentity(updated);
        setIsUploadingLogo(false);
        setUploadError(null);
        onShowToast(`Logo "${file.name}" berhasil diunggah dan disimpan ke sistem.`);
      }
    };

    reader.onerror = () => {
      setIsUploadingLogo(false);
      const errorMsg = 'Gagal membaca berkas gambar. Silakan coba pilih berkas lain.';
      setUploadError(errorMsg);
      onShowToast(errorMsg);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Reset file input value to allow re-uploading same file name if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveLogo = () => {
    const updated = { ...formData, logoUrl: '' };
    setFormData(updated);
    onUpdateIdentity(updated);
    saveStoredInstitutionIdentity(updated);
    onShowToast('Logo kustom dihapus. Menggunakan lambang inisial standar pesantren.');
  };

  // Preset sample logo with Islamic pesantren emblem
  const handleUseSampleLogo = () => {
    const sampleLogoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="95" fill="%23064E3B" stroke="%23D97706" stroke-width="4"/><circle cx="100" cy="100" r="82" fill="%2304382A" stroke="%23A7F3D0" stroke-width="1.5" stroke-dasharray="4 3"/><path d="M100 35 L122 75 L168 75 L132 102 L145 146 L100 120 L55 146 L68 102 L32 75 L78 75 Z" fill="%23D97706" opacity="0.18"/><path d="M70 125 C70 100 85 90 100 90 C115 90 130 100 130 125 L120 125 C120 106 112 100 100 100 C88 100 80 106 80 125 Z" fill="%23FBBF24"/><path d="M100 50 L107 72 L130 72 L112 85 L119 107 L100 94 L81 107 L88 85 L70 72 L93 72 Z" fill="%23FBBF24"/><path d="M65 140 Q100 128 135 140 L132 146 Q100 134 68 146 Z" fill="%23A7F3D0"/><text x="100" y="165" font-family="Arial, sans-serif" font-size="11" font-weight="900" fill="%23FFFFFF" text-anchor="middle" letter-spacing="1">RAUDHATUSSALAM</text><text x="100" y="177" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="%23A7F3D0" text-anchor="middle" letter-spacing="0.5">MAHATO</text></svg>`;
    const updated = { ...formData, logoUrl: sampleLogoSvg };
    setFormData(updated);
    onUpdateIdentity(updated);
    saveStoredInstitutionIdentity(updated);
    onShowToast('Logo contoh resmi Pondok Modern Raudhatussalam Mahato berhasil dipasang.');
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Real Logo Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        id="file-input-logo"
      />

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Identitas Pesantren & Logo</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Informasi utama yang digunakan pada dokumen resmi, laporan keuangan, dan kwitansi pembayaran santri.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold rounded-full shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Terverifikasi Kemenag
          </span>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Logo & Visual Identity Upload Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center gap-5 ${
              isDragging
                ? 'bg-emerald-50/80 border-emerald-500 ring-4 ring-emerald-100'
                : 'bg-slate-50/80 border-dashed border-slate-300 hover:border-slate-400'
            }`}
          >
            {/* Visual Logo Container with Real Image Preview */}
            <div className="relative group shrink-0">
              {formData.logoUrl ? (
                <div className="w-24 h-24 rounded-2xl bg-white border-2 border-emerald-600/30 p-1.5 shadow-sm flex items-center justify-center overflow-hidden ring-4 ring-emerald-50">
                  <img
                    src={formData.logoUrl}
                    alt="Logo Pesantren"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-[#064E3B] text-white flex flex-col items-center justify-center font-extrabold text-3xl shadow-sm border-2 border-white ring-4 ring-emerald-600/20">
                  <span>R</span>
                  <span className="text-[9px] tracking-wider uppercase font-semibold text-emerald-200 -mt-1">
                    PMRM
                  </span>
                </div>
              )}

              {/* Status indicator on logo */}
              <div
                className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white shadow-xs ${
                  formData.logoUrl ? 'bg-emerald-600' : 'bg-slate-400'
                }`}
                title={formData.logoUrl ? 'Logo kustom aktif' : 'Menggunakan logo default inisial'}
              >
                {formData.logoUrl ? '✓' : '•'}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-800">
                  Logo Resmi Pesantren
                </h3>
                {formData.logoUrl ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Logo Kustom Aktif
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                    Logo Standar Inisial
                  </span>
                )}
                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                  Maks. 5 MB • PNG / JPG / SVG
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                Tarik dan letakkan (drag & drop) file logo ke area ini, atau klik tombol untuk memilih berkas dari komputer.
                Logo ini akan langsung tampil di bilah samping (sidebar), kop kwitansi, invoice tagihan, dan laporan keuangan resmi.
              </p>

              {uploadError && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap md:flex-col gap-2 shrink-0 self-stretch md:self-center justify-end">
              <button
                type="button"
                id="btn-upload-logo"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#064E3B] hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className={`w-3.5 h-3.5 ${isUploadingLogo ? 'animate-bounce' : ''}`} />
                <span>{isUploadingLogo ? 'Memproses...' : formData.logoUrl ? 'Ganti Logo' : 'Unggah Logo Baru'}</span>
              </button>

              {formData.logoUrl ? (
                <button
                  type="button"
                  id="btn-remove-logo"
                  onClick={handleRemoveLogo}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  title="Hapus logo kustom dan kembalikan ke emblem default"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Logo</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-sample-logo"
                  onClick={handleUseSampleLogo}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  title="Pasang logo contoh resmi Raudhatussalam Mahato"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Gunakan Logo Contoh</span>
                </button>
              )}
            </div>
          </div>


          {/* Institutional Data Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Nama Lengkap Pesantren <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                required
              />
              <p className="text-[11px] text-slate-400">Dicantumkan pada baris pertama kop surat resmi.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Nama Pendek / Singkatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.shortName}
                onChange={(e) => handleChange('shortName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900"
                required
              />
              <p className="text-[11px] text-slate-400">Digunakan pada watermark dan label ringkas sistem.</p>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                Alamat Lengkap Pesantren <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-slate-900 resize-none"
                required
              />
              <p className="text-[11px] text-slate-400">Alamat lengkap mencakup jalan, RT/RW, desa, kecamatan, kabupaten, dan kode pos.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Nomor Telepon / WhatsApp Kantor
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Resmi Keuangan
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> Website Pesantren
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> Nomor Statistik Madrasah (NSM) / NPSN
              </label>
              <input
                type="text"
                value={`${formData.nsm || '121214060021'} / NPSN: ${formData.npsn || '69984321'}`}
                onChange={(e) => handleChange('nsm', e.target.value.split('/')[0]?.trim() || '')}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Nama Pimpinan Pesantren (Muddir)
              </label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={(e) => handleChange('leaderName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
              />
              <p className="text-[11px] text-slate-400">Dicantumkan sebagai pihak mengetahui pada lembar laporan resmi.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Nama Bendahara Utama
              </label>
              <input
                type="text"
                value={formData.treasurerName}
                onChange={(e) => handleChange('treasurerName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
              />
              <p className="text-[11px] text-slate-400">Dicantumkan sebagai penanggung jawab kas & pembuat laporan.</p>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              id="btn-save-identitas"
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

      {/* Preview Document Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Preview Header Dokumen Resmi
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Tampilan kop pada cetak Kwitansi & Laporan</span>
        </div>

        {/* Kop Preview Sheet */}
        <div className="bg-slate-50/70 p-6 rounded-xl border border-dashed border-slate-300">
          <div className="max-w-2xl mx-auto bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-4 border-b-2 border-slate-800 pb-3">
              {formData.logoUrl ? (
                <div className="w-14 h-14 rounded-xl border border-slate-200 p-1 flex items-center justify-center shrink-0 bg-white shadow-2xs">
                  <img
                    src={formData.logoUrl}
                    alt="Logo Pesantren"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-emerald-900 text-white flex flex-col items-center justify-center font-extrabold text-xl shrink-0">
                  <span>R</span>
                  <span className="text-[7px] text-emerald-200 uppercase font-semibold">PMRM</span>
                </div>
              )}
              <div className="flex-1 text-center pr-10">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  {formData.name}
                </h4>
                <p className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
                  Sistem Informasi Keuangan (SIMKEU)
                </p>
                <p className="text-[9.5px] text-slate-600 leading-snug mt-0.5">
                  {formData.address}
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">
                  Telp: {formData.phone} • Email: {formData.email} • NSM: {formData.nsm || '121214060021'}
                </p>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-[9px] text-slate-400 italic">
                * Garis batas dokumen otomatis menyesuaikan template ukuran kertas (A4 / Thermal).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
