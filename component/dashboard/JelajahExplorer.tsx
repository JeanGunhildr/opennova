"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Zap, ChevronLeft, ChevronRight, X, RotateCcw, Check } from "lucide-react";
import ChallengeCard from "@/component/dashboard/ChallengeCard";
import type { DashboardChallenge } from "@/lib/data/dashboard";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface ChallengeItem extends DashboardChallenge {
  categoryId?: string;
  companyType?: string; // BUMN | Perusahaan Swasta | UMKM
  rawDeadline?: string; // ISO date or timestamp for sorting
  createdAt?: string; // ISO date string
  description?: string;
  thumbnailPath?: string | null;
}

interface JelajahExplorerProps {
  initialChallenges: ChallengeItem[];
  categories: CategoryOption[];
  userFirstName?: string;
}

const MAIN_TABS = [
  { id: "all", label: "Semua" },
  { id: "terbaru", label: "Terbaru" },
  { id: "deadline", label: "Deadline Terdekat" },
] as const;

const SEEKER_TYPES = [
  { id: "all", label: "Semua Perusahaan" },
  { id: "BUMN", label: "BUMN" },
  { id: "Perusahaan Swasta", label: "Perusahaan Swasta" },
  { id: "UMKM", label: "UMKM" },
] as const;

const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "terbaru", label: "Terbaru" },
  { id: "deadline", label: "Deadline Terdekat" },
] as const;

const PAGE_SIZE = 9;

export default function JelajahExplorer({
  initialChallenges,
  categories,
  userFirstName = "",
}: JelajahExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMainTab, setActiveMainTab] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSeekerType, setActiveSeekerType] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("default");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync main tab clicks (Semua, Terbaru, Deadline Terdekat)
  const handleMainTabChange = (tabId: string) => {
    setActiveMainTab(tabId);
    setCurrentPage(1);

    if (tabId === "all") {
      setActiveSort("default");
    } else if (tabId === "terbaru") {
      setActiveSort("terbaru");
    } else if (tabId === "deadline") {
      setActiveSort("deadline");
    }
  };

  // Filter & Search logic
  const filteredChallenges = useMemo(() => {
    return initialChallenges
      .filter((ch) => {
        // 1. Search Query matches challenge title (ignores category / filter constraints)
        if (searchQuery.trim() !== "") {
          const titleMatch = ch.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
          if (!titleMatch) return false;
        }

        // 2. Category filter
        if (activeCategory !== "all") {
          const matchesCategoryName = ch.category.toLowerCase() === activeCategory.toLowerCase();
          const matchesCategoryId = ch.categoryId === activeCategory;
          if (!matchesCategoryName && !matchesCategoryId) return false;
        }

        // 3. Seeker / Company type filter
        if (activeSeekerType !== "all") {
          if (ch.companyType && ch.companyType.toLowerCase() !== activeSeekerType.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // Effective sort is either from activeSort or activeMainTab
        const effectiveSort = activeSort !== "default" ? activeSort : activeMainTab;

        if (effectiveSort === "terbaru") {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }

        if (effectiveSort === "deadline") {
          const dateA = a.rawDeadline ? new Date(a.rawDeadline).getTime() : Number.MAX_SAFE_INTEGER;
          const dateB = b.rawDeadline ? new Date(b.rawDeadline).getTime() : Number.MAX_SAFE_INTEGER;
          return dateA - dateB;
        }

        return 0;
      });
  }, [initialChallenges, searchQuery, activeCategory, activeSeekerType, activeSort, activeMainTab]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedChallenges = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredChallenges.slice(start, start + PAGE_SIZE);
  }, [filteredChallenges, safePage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById("challenge-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeSeekerType !== "all" ||
    activeSort !== "default" ||
    searchQuery.trim() !== "";

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setActiveSeekerType("all");
    setActiveSort("default");
    setActiveMainTab("all");
    setCurrentPage(1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-9 max-w-[1160px]">
      {/* Top banner pill */}
      <div className="inline-flex items-center gap-2 bg-secondary-100 text-primary-500 text-[13px] font-semibold rounded-full px-3.5 py-2 mb-5">
        <Zap size={14} strokeWidth={2.2} />
        {initialChallenges.length} Challenge Aktif Tersedia
      </div>

      {/* Page header */}
      <div>
        <h1 className="text-[32px] sm:text-[36px] lg:text-[40px] font-bold text-gray-900 tracking-[-0.025em] leading-[1.1]">
          Selamat datang{userFirstName ? `, ${userFirstName}` : ""}
        </h1>

        <p className="text-[15px] sm:text-[16px] text-gray-500 mt-2 max-w-[560px] leading-[1.5]">
          Temukan tantangan nyata dari perusahaan, BUMN hingga UMKM yang membutuhkan inovasimu. Cari berdasarkan sektor, kategori, atau nilai hadiah.
        </p>
      </div>

      {/* Search & Filter Bar (Search Input + Filter Button side-by-side) */}
      <div className="mt-6 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              strokeWidth={1.8}
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari tantangan berdasarkan judul..."
              className="h-[46px] w-full bg-white border border-[#E2E3E5] rounded-full pl-11 pr-10 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Pop-up Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={[
              "flex items-center justify-center gap-2 h-[46px] px-5 rounded-full text-[14px] font-semibold transition-all flex-shrink-0 border",
              hasActiveFilters
                ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                : "bg-white border-[#E2E3E5] text-gray-800 hover:border-gray-400",
            ].join(" ")}
          >
            <SlidersHorizontal size={16} strokeWidth={1.8} />
            Filter
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary-500" />
            )}
          </button>
        </div>

        {/* 3 Main Filter Tabs Below Search: Semua, Terbaru, Deadline Terdekat */}
        <div className="border-b border-[#D9DCDD] overflow-x-auto mt-5">
          <div className="flex gap-0 min-w-max">
            {MAIN_TABS.map((tab) => {
              const isActive = activeMainTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleMainTabChange(tab.id)}
                  className={[
                    "relative h-[50px] px-5 sm:px-6 text-[14px] whitespace-nowrap transition-colors flex-shrink-0",
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 font-medium hover:text-gray-900",
                  ].join(" ")}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-500 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pop-up Filter Modal Dialog */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsFilterModalOpen(false)}
        >
          <div
            className="bg-white border border-[#E2E3E5] rounded-[20px] shadow-2xl w-full max-w-[540px] max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gray-700" />
                <h2 className="text-[17px] font-bold text-gray-900">Filter Tantangan</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                aria-label="Tutup Filter"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Filter Options */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {/* Sort Filter */}
              <div>
                <label className="block text-[13px] font-bold text-gray-800 mb-2.5">
                  Urutan Tampilan
                </label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setActiveSort(opt.id);
                        if (opt.id !== "default") setActiveMainTab(opt.id);
                      }}
                      className={[
                        "h-[36px] px-4 rounded-full text-[13px] font-medium border transition-colors flex items-center gap-1.5",
                        activeSort === opt.id
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400",
                      ].join(" ")}
                    >
                      {activeSort === opt.id && <Check size={13} />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seeker / Company Type Filter */}
              <div>
                <label className="block text-[13px] font-bold text-gray-800 mb-2.5">
                  Jenis Perusahaan / Seeker
                </label>
                <div className="flex flex-wrap gap-2">
                  {SEEKER_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setActiveSeekerType(type.id)}
                      className={[
                        "h-[36px] px-4 rounded-full text-[13px] font-medium border transition-colors flex items-center gap-1.5",
                        activeSeekerType === type.id
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400",
                      ].join(" ")}
                    >
                      {activeSeekerType === type.id && <Check size={13} />}
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sektor Kategori (Database dynamic categories) */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-[13px] font-bold text-gray-800 mb-2.5">
                    Kategori Sektor
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto pr-1">
                    <button
                      type="button"
                      onClick={() => setActiveCategory("all")}
                      className={[
                        "h-[36px] px-4 rounded-full text-[13px] font-medium border transition-colors flex items-center gap-1.5",
                        activeCategory === "all"
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400",
                      ].join(" ")}
                    >
                      {activeCategory === "all" && <Check size={13} />}
                      Semua Kategori
                    </button>

                    {categories.map((cat) => {
                      const isActive = activeCategory === cat.name || activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategory(cat.name)}
                          className={[
                            "h-[36px] px-4 rounded-full text-[13px] font-medium border transition-colors flex items-center gap-1.5",
                            isActive
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400",
                          ].join(" ")}
                        >
                          {isActive && <Check size={13} />}
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Action Controls */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RotateCcw size={13} />
                Reset Filter
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  setIsFilterModalOpen(false);
                }}
                className="h-[42px] px-6 bg-primary-500 hover:bg-primary-600 text-white text-[14px] font-semibold rounded-full transition-colors shadow-sm"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Grid Summary */}
      <div id="challenge-grid" className="flex items-center justify-between mb-4">
        <p className="text-[14px] text-gray-500">
          Menampilkan <span className="font-semibold text-gray-900">{filteredChallenges.length}</span> challenge
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[13px] text-primary-500 font-semibold hover:underline"
          >
            Hapus Filter
          </button>
        )}
      </div>

      {/* Challenge Cards Grid */}
      {paginatedChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {paginatedChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E1E3E5] rounded-[16px] p-12 text-center my-6">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search size={22} />
          </div>
          <h3 className="text-[16px] font-bold text-gray-900 mb-1">Challenge Tidak Ditemukan</h3>
          <p className="text-[14px] text-gray-500 max-w-[400px] mx-auto mb-4">
            Tidak ada tantangan yang sesuai dengan pencarian atau filter yang kamu pilih.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="h-[40px] px-5 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-[13px] font-semibold transition-colors"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Pagination Controls (Max 9 items per page) */}
      {totalPages > 1 && (
        <div className="mt-9 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => handlePageChange(safePage - 1)}
            className="h-[40px] w-[40px] rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === safePage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={[
                    "h-[40px] min-w-[40px] px-3.5 rounded-full text-[14px] font-semibold transition-colors",
                    isCurrent
                      ? "bg-primary-500 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => handlePageChange(safePage + 1)}
            className="h-[40px] w-[40px] rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Halaman Selanjutnya"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
