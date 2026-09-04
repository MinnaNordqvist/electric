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

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);



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
         <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}>
            &laquo; Prev
        </button>   
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}>
            Next &raquo;
        </button>    



        </div>
        </>
    )
}