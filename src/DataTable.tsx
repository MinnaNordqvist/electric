import { useEffect, useState, useMemo } from "react";


export function DataTable(){
    const [data, setData] = useState<any[]>([]);  
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;


    useEffect(() => {
         fetch('/api')
        .then((res) => res.json())
        .then((resData) => {
            setData([...resData]); 
        });
    }, []);

    const totalPages = Math.ceil(data.length / pageSize)
    
    const currentTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return data.slice(startIndex, startIndex + pageSize);
    }, [data, currentPage]);

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
        <>
        <div className="table-wrapper">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Production (MWh/h)</th>
              <th>Total Consumption (kWh)</th>
              <th>Avgerage Daily Price (snt/kWh)</th>
              <th>Longest Negative Price Streak (h)</th>
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