import React,{useState,useEffect} from 'react';
import trade from "../Assets/trade.gif"

export default function TableData({ data,Strike }) {
    const [highlighted, setHighlighted] = useState(null); 

    useEffect(() => {
        // If highlighted is already set, no need to recompute
        if (highlighted !== null) setHighlighted(-1);
        // Find the first strike price that meets the condition
        const firstMatchingStrike = data.find(elem => Strike <= elem.strikePrice);

        // Set the highlighted state accordingly
        if (firstMatchingStrike) {
            // console.log(firstMatchingStrike)
            setHighlighted(firstMatchingStrike.strikePrice);
            
        }
        else {
            setHighlighted(-1);
        }
    }, [data, Strike, highlighted])

    if (!Array.isArray(data)) {
        return null; 
    }
    
    // console.log(Strike);
    // style={{backgroundColor: Strike<elem.strikePrice  ?"yellow":"white" }}

    return (
        <>
            {data.map((elem, ind) =>{
                     
                return <tr key={ind} >
                
                    {/* Render your table cells here */}
                    <td ><img src={trade} alt="trade" /></td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.openInterest:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}> {elem.CE?elem.CE.changeinOpenInterest:"-"} </td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.totalTradedVolume:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.impliedVolatility:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.lastPrice:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.change.toFixed(2):"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.bidQty:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.bidprice:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.askPrice:"-"}</td>
                    <td style={{ backgroundColor: Strike > elem.strikePrice  ? "#F1EED9":"white" }}>{elem.CE?elem.CE.askQty:"-"}</td>

                    <td style={{ backgroundColor: highlighted === -1 ? "white" : elem.strikePrice === highlighted ? "red" : "white" }}>{elem.strikePrice}</td>

                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.bidQty:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.bidprice:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.askPrice:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.askQty:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.change.toFixed(2):"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.lastPrice:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.impliedVolatility:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.totalTradedVolume:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.changeinOpenInterest:"-"}</td>
                    <td style={{ backgroundColor: Strike < elem.strikePrice  ? "#F1EED9":"white" }}>{elem.PE?elem.PE.openInterest:"-"}</td>
                    <td><img src={trade} alt="trade" /></td>
                </tr>
                })}
        </>
    );
}
