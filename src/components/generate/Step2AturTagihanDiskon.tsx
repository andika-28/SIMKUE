import React from 'react';
import {
  Utensils,
  Receipt,
  FileSpreadsheet,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Info,
  Tag,
  Calculator,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { GenerateBillingConfig } from '../../types';

interface Step2AturTagihanDiskonProps {
  config: GenerateBillingConfig;
  onChangeConfig: (newConfig: Partial<GenerateBillingConfig>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Step2AturTagihanDiskon: React.FC<Step2AturTagihanDiskonProps> = ({
  config,
  onChangeConfig,
  onBack,
  onNext,
}) => {
  // Numbers of students per package
  const countPaketA = 35;
  const countPaketB = 65;
  const countPaketC = 200;
  const totalSantri = 300;

  // Final per-student amounts
  const finalMakanA = Math.max(0, config.paketANominal - config.paketADiscount);
  const totalPerSantriA = config.sppNominal + finalMakanA + config.listrikAirNominal;
  const estTotalA = totalPerSantriA * countPaketA;

  const finalMakanB = Math.max(0, config.paketBNominal - config.paketBDiscount);
  const totalPerSantriB = config.sppNominal + finalMakanB + config.listrikAirNominal;
  const estTotalB = totalPerSantriB * countPaketB;

  const finalMakanC = Math.max(0, config.paketCNominal - config.paketCDiscount);
  const totalPerSantriC = config.sppNominal + finalMakanC + config.listrikAirNominal;
  const estTotalC = totalPerSantriC * countPaketC;

  const grandTotalEstimasi = estTotalA + estTotalB + estTotalC;
  const totalDiskonNominal =
    config.paketADiscount * countPaketA +
    config.paketBDiscount * countPaketB +
    config.paketCDiscount * countPaketC;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
            Konfigurasi Tagihan & Diskon
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-0.5">
            Periksa nominal tagihan wajib dan atur penyesuaian diskon untuk periode{' '}
            <strong className="text-[#064E3B] font-bold">{config.bulan}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-[#064E3B] border border-emerald-200 rounded-xl text-xs font-bold w-fit">
          <Receipt className="w-4 h-4 text-[#064E3B]" />
          <span>300 Santri Aktif Terdaftar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Config Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 1: TAGIHAN WAJIB BULANAN */}
          <div
            id="section-tagihan-wajib"
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
          >
            <div className="p-4 md:p-5 border-b border-[#E2E8F0] bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 text-[#064E3B]" />
                <h3 className="text-sm font-bold text-[#0F172A] tracking-tight uppercase">
                  1. Tagihan Wajib Bulanan
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B] font-medium hidden sm:inline">
                Berlaku untuk semua santri
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-slate-50 text-[#64748B] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Jenis Tagihan</th>
                    <th className="py-3 px-4 text-right">Nominal Normal</th>
                    <th className="py-3 px-4 text-center">Diskon</th>
                    <th className="py-3 px-4 text-right">Nominal Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] font-medium text-[#0F172A]">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold">
                      <div className="text-sm text-[#0F172A]">SPP (Sumbangan Pembinaan Pendidikan)</div>
                      <div className="text-[11px] text-[#64748B]">Biaya operasional pendidikan santri bulanan</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700">
                      Rp 200.000
                    </td>
                    <td className="py-3 px-4 text-center text-[#64748B]">
                      Rp 0
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#064E3B]">
                      Rp 200.000
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold">
                      <div className="text-sm text-[#0F172A]">Listrik & Air</div>
                      <div className="text-[11px] text-[#64748B]">Biaya utilitas fasilitas asrama dan kelas</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700">
                      Rp 50.000
                    </td>
                    <td className="py-3 px-4 text-center text-[#64748B]">
                      Rp 0
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#064E3B]">
                      Rp 50.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-slate-50/80 border-t border-[#E2E8F0] flex items-center gap-2 text-[11px] text-[#64748B]">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Nominal mengikuti konfigurasi master tagihan pesantren.</span>
            </div>
          </div>

          {/* SECTION 2: KONFIGURASI UANG MAKAN */}
          <div
            id="section-konfigurasi-uang-makan"
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden"
          >
            <div className="p-4 md:p-5 border-b border-[#E2E8F0] bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-[#064E3B]" />
                <h3 className="text-sm font-bold text-[#0F172A] tracking-tight uppercase">
                  2. Konfigurasi Uang Makan & Diskon Khusus
                </h3>
              </div>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Diskon Fleksibel
              </span>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <p className="text-xs text-[#64748B]">
                Atur nominal potongan jika kegiatan dapur pesantren tidak berjalan satu bulan penuh (misal masa liburan atau kepulangan santri).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CARD A: PAKET A */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                        Paket A
                      </span>
                      <span className="text-[10px] text-[#64748B] font-bold">35 Santri</span>
                    </div>
                    <div className="text-xs font-bold text-[#0F172A] mt-2">
                      Full makan di rumah
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      Santri non-asrama
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Nominal Normal:</span>
                      <span className="font-bold text-slate-700">Rp 0</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Diskon:</span>
                      <span className="font-medium text-slate-400">Rp 0</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#0F172A] pt-1 border-t border-slate-200">
                      <span>Nominal Akhir:</span>
                      <span className="text-emerald-700">Rp 0</span>
                    </div>
                  </div>
                </div>

                {/* CARD B: PAKET B */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                        Paket B
                      </span>
                      <span className="text-[10px] text-[#64748B] font-bold">65 Santri</span>
                    </div>
                    <div className="text-xs font-bold text-[#0F172A] mt-2">
                      2x makan di rumah
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      1x makan siang pesantren
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Nominal Normal:</span>
                      <span className="font-bold text-slate-700">Rp 200.000</span>
                    </div>

                    <div>
                      <label
                        htmlFor="input-diskon-b"
                        className="block text-[11px] font-bold text-slate-700 mb-1"
                      >
                        Potongan Diskon:
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-[11px] font-bold text-slate-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          id="input-diskon-b"
                          min="0"
                          max="200000"
                          step="10000"
                          value={config.paketBDiscount}
                          onChange={(e) =>
                            onChangeConfig({
                              paketBDiscount: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-full h-8 pl-8 pr-2 text-xs bg-white border border-slate-300 rounded-lg text-[#0F172A] font-bold focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between font-bold text-[#0F172A] pt-1.5 border-t border-slate-200">
                      <span>Nominal Akhir:</span>
                      <span className="text-emerald-700">
                        Rp {finalMakanB.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD C: PAKET C */}
                <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/20 flex flex-col justify-between space-y-3 shadow-xs relative">
                  <div className="absolute -top-2.5 right-3 bg-[#064E3B] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Mayoritas
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md">
                        Paket C
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold">200 Santri</span>
                    </div>
                    <div className="text-xs font-bold text-[#0F172A] mt-2">
                      Full makan di pesantren
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">
                      3x makan dapur asrama
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-emerald-200 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Nominal Normal:</span>
                      <span className="font-bold text-slate-700">Rp 600.000</span>
                    </div>

                    <div>
                      <label
                        htmlFor="input-diskon-c"
                        className="block text-[11px] font-bold text-[#064E3B] mb-1"
                      >
                        Potongan Diskon:
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1.5 text-[11px] font-bold text-emerald-600">
                          Rp
                        </span>
                        <input
                          type="number"
                          id="input-diskon-c"
                          min="0"
                          max="600000"
                          step="10000"
                          value={config.paketCDiscount}
                          onChange={(e) =>
                            onChangeConfig({
                              paketCDiscount: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-full h-8 pl-8 pr-2 text-xs bg-white border border-emerald-300 rounded-lg text-[#064E3B] font-bold focus:ring-1 focus:ring-[#064E3B] focus:border-[#064E3B]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between font-bold text-[#0F172A] pt-1.5 border-t border-emerald-200">
                      <span>Nominal Akhir:</span>
                      <span className="text-emerald-700 font-extrabold text-sm">
                        Rp {finalMakanC.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: CATATAN DISKON */}
          <div
            id="section-catatan-diskon"
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-2"
          >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#064E3B]" />
              <label
                htmlFor="input-catatan-diskon"
                className="text-xs font-bold uppercase tracking-wider text-[#0F172A]"
              >
                3. Keterangan / Alasan Diskon (Opsional)
              </label>
            </div>
            <textarea
              id="input-catatan-diskon"
              rows={3}
              value={config.catatanDiskon}
              onChange={(e) => onChangeConfig({ catatanDiskon: e.target.value })}
              placeholder="Contoh: Diskon bulan Agustus karena kegiatan belajar tidak berlangsung selama satu bulan penuh."
              className="w-full p-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#064E3B] focus:border-transparent resize-none shadow-2xs"
            />
            <span className="text-[11px] text-[#64748B]">
              Catatan ini akan tercantum pada rincian slip dan riwayat penagihan santri.
            </span>
          </div>
        </div>

        {/* Right Column: Live Billing Simulation Panel */}
        <div className="space-y-6">
          <div
            id="panel-live-billing-simulation"
            className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden sticky top-6"
          >
            {/* Panel Header */}
            <div className="p-5 border-b border-[#E2E8F0] bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#064E3B]" />
                <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">
                  Simulasi Tagihan Santri
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Live Real-Time
              </span>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Simulation: Paket A */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Paket A (35 Santri)</span>
                  <span className="font-extrabold text-[#064E3B]">
                    Rp {estTotalA.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-[#64748B]">
                  <div>SPP: Rp200rb</div>
                  <div>Makan: Rp0</div>
                  <div>Listrik: Rp50rb</div>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 pt-1 border-t border-slate-200 flex justify-between">
                  <span>Tagihan/santri:</span>
                  <span>Rp {totalPerSantriA.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Simulation: Paket B */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Paket B (65 Santri)</span>
                  <span className="font-extrabold text-[#064E3B]">
                    Rp {estTotalB.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-[#64748B]">
                  <div>SPP: Rp200rb</div>
                  <div>Makan: Rp{(finalMakanB / 1000)}rb</div>
                  <div>Listrik: Rp50rb</div>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 pt-1 border-t border-slate-200 flex justify-between">
                  <span>Tagihan/santri:</span>
                  <span>Rp {totalPerSantriB.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Simulation: Paket C */}
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F172A]">Paket C (200 Santri)</span>
                  <span className="font-extrabold text-[#064E3B]">
                    Rp {estTotalC.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px] text-[#64748B]">
                  <div>SPP: Rp200rb</div>
                  <div>Makan: Rp{(finalMakanC / 1000)}rb</div>
                  <div>Listrik: Rp50rb</div>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 pt-1 border-t border-emerald-200 flex justify-between">
                  <span>Tagihan/santri:</span>
                  <span>Rp {totalPerSantriC.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Grand Total Card */}
              <div className="p-4 bg-gradient-to-br from-[#064E3B] to-[#047857] text-white rounded-xl shadow-xs space-y-2">
                <div className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider">
                  Total Estimasi Tagihan
                </div>
                <div className="text-2xl font-black tracking-tight">
                  Rp {grandTotalEstimasi.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-emerald-100 flex items-center justify-between pt-2 border-t border-emerald-600/50 font-medium">
                  <span>Total Santri Aktif:</span>
                  <span className="font-bold text-white">300 Santri</span>
                </div>
                {totalDiskonNominal > 0 && (
                  <div className="text-xs text-amber-200 flex items-center justify-between font-medium">
                    <span>Total Diskon Diberikan:</span>
                    <span className="font-bold text-amber-100">
                      - Rp {totalDiskonNominal.toLocaleString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Step Actions */}
      <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex items-center justify-between">
        <button
          type="button"
          id="btn-step2-back"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#64748B] hidden sm:inline">
            Langkah 2 dari 4: Nominal & Formula
          </span>
          <button
            type="button"
            id="btn-step2-next"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#064E3B] hover:bg-[#047857] text-white text-xs font-bold rounded-xl shadow-xs transition-all hover:shadow-sm active:scale-98"
          >
            <span>Preview Tagihan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
