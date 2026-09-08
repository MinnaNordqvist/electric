import { useEffect, useState, useMemo } from "react";

import { FilterDialog, FilterCriteria, ActiveFilter } from "./FilterDialog";

interface Electric {
  date: string;
  total_production: number;
  total_consumption: number;
  average_price: number;
  longest_consecutive_negative_hours: number;
}

type SortField = keyof Electric;
type SortDirection = "asc" | "desc";


interface DataTableProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}


export function DataTable({selectedDate, onDateChange }: DataTableProps){
    const [data, setData] = useState<any[]>([]);  
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<FilterCriteria>({});
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);


    // Fetch data from backend
    useEffect(() => {
         fetch('/api')
        .then((res) => res.json())
        .then((resData) => {
            setData([...resData]); 
        });
    }, []);

    // Set start and end dates
    const { minDate, maxDate } = useMemo(() => {
        if (!data.length) return { minDate: "", maxDate: "" };

        let min = data[0].date;
        let max = data[0].date;

        for (const row of data) {
            if (row.date < min) min = row.date;
            if (row.date > max) max = row.date;
        }

        return {
            minDate: min,
            maxDate: max,
        };
    }, [data]);

   

    // Filter dialog
    const filteredData = useMemo(() =>{
        return data.filter((row) => {
      
        if (filters.year && !row.date.startsWith(filters.year)) {
            return false;
        }

    
        if (filters.month) {
            if (filters.year) {
                if (!row.date.startsWith(`${filters.year}-${filters.month}`)) return false;
            } else if (row.date.slice(5, 7) !== filters.month) {
                return false;
            }
        }

        if (filters.minProduction !== "" && filters.minProduction !== undefined && row.total_production < filters.minProduction) {
            return false;
        }
        if (filters.maxProduction !== "" && filters.maxProduction !== undefined && row.total_production > filters.maxProduction) {
            return false;
        }

        if (filters.minConsumption !== "" && filters.minConsumption !== undefined && row.total_consumption < filters.minConsumption) {
            return false;
        }
        if (filters.maxConsumption !== "" && filters.maxConsumption !== undefined && row.total_consumption > filters.maxConsumption) {
            return false;
        }

        if (filters.minPrice !== "" && filters.minPrice !== undefined && row.average_price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice !== "" && filters.maxPrice !== undefined && row.average_price > filters.maxPrice) {
            return false;
        }

        if (filters.minStreak !== "" && filters.minStreak !== undefined && row.longest_consecutive_negative_hours < filters.minStreak) {
            return false;
        }
        if (filters.maxStreak !== "" && filters.maxStreak !== undefined && row.longest_consecutive_negative_hours > filters.maxStreak) {
            return false;
        }

        return true;
      });
    }, [data, filters]);

    const hasActiveFilters = Object.values(filters).some((val) => val !== "" && val !== undefined);

    // Remove filter
    const handleRemoveChip = (chipKey: string) => {
        setActiveFilters((prev) => prev.filter((item) => item.key !== chipKey));

        setFilters((prev) => {
            const next = { ...prev };

            if (chipKey in next) {
                delete next[chipKey as keyof FilterCriteria];
                return next;
            }

            return next;
        });

        setCurrentPage(1);
    };
  
    // Clear all filters
   const handleClearAllFilters = () => {
        setFilters({});
        setActiveFilters([]);
        setCurrentPage(1);
    };



    // Select Date for DailyView
    const dailyData = useMemo(() => {
        if (!selectedDate) return filteredData;
        return filteredData.filter((row) => row.date === selectedDate);
    }, [filteredData, selectedDate]);


    // Sort by column
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setCurrentPage(1); 
    };

    const sortedData = useMemo(() => {
        if (dailyData.length <= 1) return dailyData;
        
        return [...dailyData].sort((a, b) => {
            if (sortField === "date") {
                return sortDirection === "asc" 
                ? String(a.date).localeCompare(String(b.date))
                : String(b.date).localeCompare(String(a.date));
            }
            
            const parseNum = (val: any) => {
                if (typeof val === "number") return val;
                if (!val) return 0;
            
                const num = Number(String(val).replace(",", "."));
                return isNaN(num) ? 0 : num;
            };
            
            const numA = parseNum(a[sortField]);
            const numB = parseNum(b[sortField]);

            return sortDirection === "asc" ? numA - numB : numB - numA;
        
        });
    }, [dailyData, sortField, sortDirection]);

    
    const renderSortArrow = (field: SortField) => {
        if (sortField !== field) {
            return <span className="sort-indicator inactive">↕</span>;
        }
        return (
            <span className="sort-indicator">
                {sortDirection === "asc" ? "▲" : "▼"}
            </span>
        );
    };

   
    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize)
    
    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage]);

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    const pageNumbers = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );

  

    return(
       
        <div className="table-wrapper">
        
            <div className="table-controls">
                <button
                    className={`btn-filter-trigger ${hasActiveFilters ? "active" : ""}`}
                    onClick={() => setIsFilterOpen(true)}
                >
                    🔍 {hasActiveFilters ? "Filters Applied" : "Filter Data"}
                </button>
        
                {activeFilters.length > 0 && (
                    <div className="active-filters-bar">
                        <span className="active-filters-label">Active:</span>
                            {activeFilters.map(({ key, value }) => (
                                <span key={key} className="filter-chip">
                                <span className="filter-chip-key">{key}:</span> {value}
                            <button
                                type="button"
                                className="btn-chip-remove"
                                onClick={() => handleRemoveChip(key)}
                            >
                            &times;
                            </button>
                        </span>
                            ))}
                    </div>
                )}
                {hasActiveFilters && (
                    <button className="btn-filter-trigger" onClick={handleClearAllFilters}>
                        Clear Filters
                    </button>
                )}
       

                <span className="record-count">
                    Showing {sortedData.length} of {data.length} records
                </span>
            </div>
            <FilterDialog
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                activeFilters={filters}
                data={data}
                onApply={(newFilters, newActivePairs) => {
                    setFilters(newFilters);
                    setActiveFilters(newActivePairs);
                    onDateChange("");
                    setCurrentPage(1);
                }}
            />
            <div className="filter-bar">
                <label htmlFor="date-filter">Select Date:</label>
                    <input
                        id="date-filter"
                        type="date"
                        className="date-picker-input"
                        min={minDate}
                        max={maxDate}
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                {selectedDate && (
                    <button
                        className="btn-filter-trigger"
                        onClick={() => {
                            onDateChange("");
                            setCurrentPage(1);
                        }}
                    >
                        Clear Date
                    </button>
                )}
            </div>
            <table className="dataTable">
                <thead>
                 <tr>
                    <th className="sortable" onClick={() => handleSort("date")} >Date    {renderSortArrow("date")}</th>
                    <th className="sortable" onClick={() => handleSort("total_production")} >Total Production (MWh/h) {renderSortArrow("total_production")}</th>
                    <th className="sortable" onClick={() => handleSort("total_consumption")} >Total Consumption (kWh) {renderSortArrow("total_consumption")}</th>
                    <th className="sortable" onClick={() => handleSort("average_price")}>Avgerage Daily Price (snt/kWh) {renderSortArrow("average_price")}</th>
                    <th className="sortable" onClick={() => handleSort("longest_consecutive_negative_hours")}>Longest Negative Price Streak (h) {renderSortArrow("longest_consecutive_negative_hours")}</th>
                 </tr>
                </thead>
                <tbody>
                    {currentTableData.map((row) => (
                    <tr key={row.date}>
                    <td>{row.date}</td>
                    <td>{Number(row.total_production).toLocaleString()}</td>
                    <td>{Number(row.total_consumption).toLocaleString()}</td>
                    <td>{Number(row.average_price)}</td>
                    <td>{Number(row.longest_consecutive_negative_hours)}</td>
                    </tr>   
                    ))}
                </tbody>
            </table>
        
            <div className="pagination-container">
                <button
                    className="btn-nav"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}>
                    &laquo; First
                </button>

                <button 
                    className="btn-nav"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}>
                    Prev
                </button>   
       
                {startPage > 1 && <span className="pagination-ellipsis">...</span>}        

                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        className={`btn-page ${number === currentPage ? "active" : ""}`}>
                        {number}
                    </button>   
                ))}  

                {endPage < totalPages && <span className="pagination-ellipsis">...</span>}
          
                <button
                    className="btn-nav"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}>
                    Next 
                </button>    
        
                <button
                    className="btn-nav"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}>
                    Last &raquo;
                </button> 
            </div>    

        </div>
     
    )
}