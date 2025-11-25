import React from 'react';

type FilterType = 'frontend' | 'backend' | 'creative' | 'future' | null;

interface FilterLegendProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterLegend: React.FC<FilterLegendProps> = ({ activeFilter, onFilterChange }) => {
  const LegendItem = ({ color, label, type }: { color: string, label: string, type: string }) => {
    const isActive = activeFilter === type;
    return (
      <div 
        onClick={() => onFilterChange(isActive ? null : type as FilterType)} 
        className={`flex items-center gap-2 cursor-pointer p-1.5 rounded transition-all duration-300 ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}`}
      >
        <div 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ backgroundColor: color, boxShadow: isActive ? `0 0 12px ${color}` : 'none' }}
        ></div>
        <span className={`text-slate-300 font-medium ${isActive ? 'text-white' : ''}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 text-xs shadow-2xl transform transition-all hover:scale-105 hidden md:block pointer-events-auto select-none">
      <h4 className="text-slate-400 font-bold mb-3 uppercase tracking-wider text-[10px] border-b border-white/10 pb-2">
        System Protocol
      </h4>
      <div className="space-y-1">
        <LegendItem color="#22d3ee" label="Frontend Core" type="frontend" />
        <LegendItem color="#34d399" label="Backend Systems" type="backend" />
        <LegendItem color="#c084fc" label="Creative Engine" type="creative" />
        <LegendItem color="transparent" label="Future Modules" type="future" />
      </div>
    </div>
  );
};

export default FilterLegend;