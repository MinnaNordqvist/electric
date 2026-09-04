import { useEffect, useState, useMemo } from "react";

interface Electric {
  date: string;
  hours: number;
  total_production: number;
  total_consumption: number;
  average_price: number;
  longest_consecutive_negative_hours: number;
}

type SortField = keyof Electric;
type SortDirection = "asc" | "desc";

export function DataTable(){
    const [data, setData] = useState<any[]>([]);  
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    useEffect(() => {
         fetch('/api')
        .then((res) => res.json())
        .then((resData) => {
            setData([...resData]); 
        });
    }, []);

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
        return [...data].sort((a, b) => {
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
    }, [data, sortField, sortDirection]);

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


    return(
        <>
        <div className="table-wrapper">
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
            &laquo;&laquo; First
        </button>

         <button 
            className="btn-nav"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}>
            &laquo; Prev
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
            Next &raquo;
        </button>    
        
        <button
            className="btn-nav"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}>
            Last &raquo;&raquo;
        </button> 
        </div>    

        </div>
        </>
    )
}