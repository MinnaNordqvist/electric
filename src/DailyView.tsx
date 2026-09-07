import { useEffect, useState } from "react"

interface Daily {
    date: string,
    starttime: string,
    productionamount: number,
    consumptionamount: number,
    hourlyprice: number
}



export function DailyView(){
     const [data, setData] = useState<any[]>([]);  

    useEffect(() => {
        fetch('api/day')
        .then((res) => res.json())
        .then((resData) => {
            setData([...resData]); 
        });
    }, []);



    return(
        <>
        <p>Daily view {data.length}</p>
          <tbody>
            {data.map((row) => (
             <tr key={row.date}>
             <td>{row.date}</td>
             <td>{row.starttime}</td>
             <td>{Number(row.productionamount).toLocaleString()}</td>
             <td>{Number(row.consumptionamount).toLocaleString()}</td>
             <td>{Number(row.hourlyprice)}</td>
             </tr>   
            ))}
          </tbody>
        </>
    )
}