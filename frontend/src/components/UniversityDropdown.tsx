import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Building } from 'lucide-react';
import { CollegeItem, UNIS } from '../data/colleges';

interface UniversityDropdownProps {
  selectedCollege: CollegeItem | null;
  onSelect: (college: CollegeItem) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export const UniversityDropdown: React.FC<UniversityDropdownProps> = ({
  selectedCollege,
  onSelect,
  label = "College / University Affiliation",
  placeholder = "Select your institution or university..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredColleges = UNIS.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.short.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleImgError = (id: string) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const getLogoSrc = (college: CollegeItem) => {
    if (imgErrors[college.id] && college.fallbackLogo) {
      return college.fallbackLogo;
    }
    return college.logo || college.fallbackLogo || '';
  };

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
      {label && (
        <label className="block text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
          {label}
        </label>
      )}

      {/* Selected Box with left 32x32 logo on white bg */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full bg-[#1A1F3D] border ${
          isOpen ? 'border-[#7C5CFC] ring-2 ring-[#7C5CFC]/20' : 'border-white/10 hover:border-[#7C5CFC]/50'
        } rounded-xl px-3 py-2 flex items-center justify-between text-left transition-all cursor-pointer shadow-inner min-h-[48px]`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedCollege ? (
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg bg-white p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs border border-white/20">
              <img 
                src={getLogoSrc(selectedCollege)} 
                alt={selectedCollege.short}
                onError={() => handleImgError(selectedCollege.id)}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 min-w-[32px] min-h-[32px] rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4 text-slate-400" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {selectedCollege ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white truncate block">
                  {selectedCollege.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-medium shrink-0">
                  {selectedCollege.city}
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-400 truncate block">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#7C5CFC]' : ''}`} />
      </button>

      {/* Top-down searchable dropdown panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-[#0B0F2A] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Search bar */}
          <div className="p-2 border-b border-white/10 bg-[#0E1538]/90">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search university or city (e.g. Bareilly, Lucknow)..."
                autoFocus
                className="w-full bg-[#1A1F3D] border border-white/10 focus:border-[#7C5CFC] text-slate-200 placeholder-slate-500 text-xs rounded-lg pl-8 pr-3 py-1.5 outline-none"
              />
            </div>
          </div>

          {/* List of Colleges: each row 56px height, left 40x40 logo bg white rounded 8px p-1.5 object-contain */}
          <div className="max-h-60 overflow-y-auto divide-y divide-white/[0.04] scrollbar-thin scrollbar-thumb-white/10">
            {filteredColleges.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching university found
              </div>
            ) : (
              filteredColleges.map((college) => {
                const isSelected = selectedCollege?.id === college.id;
                return (
                  <div
                    key={college.id}
                    onClick={() => {
                      onSelect(college);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`h-14 px-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#7C5CFC]/20' : 'hover:bg-[#7C5CFC]/12'
                    }`}
                  >
                    {/* Left: 40x40 logo bg white rounded 8px p-1.5 object-contain */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                        <img 
                          src={getLogoSrc(college)} 
                          alt={college.short}
                          onError={() => handleImgError(college.id)}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                          {college.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-white/40">
                            {college.short}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/50">
                            {college.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityDropdown;
