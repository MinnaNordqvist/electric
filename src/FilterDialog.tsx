import { useState, useEffect, useMemo } from "react";


export interface FilterCriteria {
    year?: string;
    month?: string;
    minProduction?: number | "";
    maxProduction?: number | "";
    minConsumption?: number | "";
    maxConsumption?: number | "";
    minPrice?: number | "";
    maxPrice?: number | "";
    minStreak?: number | "";
    maxStreak?: number | "";
}

 type Props = {
    isOpen: boolean;
    onClose: () => void;
    activeFilters: FilterCriteria;
    onApply: (filters: FilterCriteria) => void;
    data: Array<{ date: string }>;
}

const MONTHS = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];



export function FilterDialog({ isOpen, onClose, activeFilters, onApply, data }: Props) {
    const [draft, setDraft] = useState<FilterCriteria>(activeFilters);
    
    useEffect(() => {
        setDraft(activeFilters);
    }, [activeFilters, isOpen]);
    
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        for (const row of data) {
            if (row.date && row.date.length >= 4) {
                years.add(row.date.slice(0, 4));
            }
        }
        return Array.from(years).sort().reverse(); 
    }, [data]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h2>Filter Data</h2>
                <button className="btn-close-icon" onClick={onClose}>&times;</button>
            </div>      
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                    <label htmlFor="filter-year">Year:</label>
                    <select
                        id="filter-year"
                        value={draft.year || ""}
                        onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                    >
                    <option value="">All Years</option>
                        {availableYears.map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="filter-month">Month:</label>
              <select
                id="filter-month"
                value={draft.month || ""}
                onChange={(e) => setDraft({ ...draft, month: e.target.value })}
              >
                <option value="">All Months</option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

        <div className="form-group">
            <label htmlFor="filter-min-production">Min Production (MWh/h):</label>  
             <input
              id="filter-min-production"
              type="number"
              min="0"
              step="0.1"
              value={draft.minProduction ?? ""}
              onChange={(e) => setDraft({ ...draft, minProduction: e.target.value === "" ? "" : Number(e.target.value) })}
            />  
        </div>        

        <div className="form-group">
            <label htmlFor="filter-max-production">Max Production (MWh/h):</label>
            <input
              id="filter-max-production"
              type="number"
              min="0"
              step="0.1"
              value={draft.maxProduction ?? ""}
              onChange={(e) => setDraft({ ...draft, maxProduction: e.target.value === "" ? "" : Number(e.target.value) })}
            />  
        </div>        

        <div className="form-group">
            <label htmlFor="filter-min-consumption">Min Consumption (kWh):</label>
            <input
              id="filter-min-consumption"
              type="number"
              min="0"
              step="0.1"
              value={draft.minConsumption ?? ""}
              onChange={(e) => setDraft({ ...draft, minConsumption: e.target.value === "" ? "" : Number(e.target.value) })}
            />      
        </div>        

        <div className="form-group">
            <label htmlFor="filter-max-consumption">Max Consumption (kWh):</label>
            <input
              id="filter-max-consumption"
              type="number"
              min="0"
              step="0.1"
              value={draft.maxConsumption ?? ""}
              onChange={(e) => setDraft({ ...draft, maxConsumption: e.target.value === "" ? "" : Number(e.target.value) })}
            />  
        </div>                


        <div className="form-group">
            <label htmlFor="filter-min-price">Min Price (snt/kWh):</label>
            <input
              id="filter-min-price"
              type="number"
              step="0.1"
              value={draft.minPrice ?? ""}
              onChange={(e) => setDraft({ ...draft, minPrice: e.target.value === "" ? "" : Number(e.target.value) })}
            />
        </div>                

        <div className="form-group">
            <label htmlFor="filter-max-price">Max Price (snt/kWh):</label>
             <input
              id="filter-max-price"
              type="number"
              step="0.1"
              value={draft.maxPrice ?? ""}
              onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value === "" ? "" : Number(e.target.value) })}
            />
        </div>        

        <div className="form-group">
           <label htmlFor="filter-min-streak">Min consecutive negative hours</label>
           <input
              id="filter-min-streak"
              type="number"
              min="0"
              max="24"
              step="1"
              value={draft.minStreak ?? ""}
              onChange={(e) => setDraft({ ...draft, minStreak: e.target.value === "" ? "" : Number(e.target.value) })}
            />
        </div>        

         <div className="form-group">
           <label htmlFor="filter-max-streak">Max consecutive negative hours</label>
           <input
              id="filter-max-streak"
              type="number"
              min="0"
              max="24"
              step="1"
              value={draft.maxStreak ?? ""}
              onChange={(e) => setDraft({ ...draft, maxStreak: e.target.value === "" ? "" : Number(e.target.value) })}
            />
        </div>   


        <div className="modal-footer">
          <button
                className="btn-secondary"
                onClick={() => {
                setDraft({});
                onApply({});
                onClose();
                }}
            >
            Clear All
          </button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => { onApply(draft); onClose(); }}>
            Apply Filter
          </button>
        </div>            

                </div>
    </div>   
    )
}