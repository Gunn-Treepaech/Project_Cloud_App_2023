import { useState } from "react"
function Showlist2(props){
    const dataName = props.data.data
    const datakey = props.value
    const datapaymet = props.payment
    

   // const [databank, setbank] = useState();
    //const dataName =  props.data
    //const [datashow, setdatashow] = useState([])
    console.log("mmm",props);
    console.log("ooo",dataName);
    console.log("ggg",dataName);
    let tii = []
    for(let key in dataName){
        //let tii = []
        let tiichek = dataName[key]
        if(key == datakey){
            console.log("lll",key);
            console.log("hhh",tiichek);
            tii = tiichek
            //setdatashow(tiichek)
        }
        
        //console.log("uuuu",tii);
        //console.log("fff",datashow);
        
    }
    //console.log("vvvv",tii);
    if (!dataName) {
        // Handle the case where data is not defined or null
        return null;
      }
    
    return (
        <tbody>
        {tii.map((item, index) => (
          <tr key={index}>
            <td>{item.year}</td>
            <td>{item.month}</td>
            <td>{datapaymet}</td>
            <td>{item.interest}</td>
            <td>{item.balance}</td>
            <td>{item.overpayment}</td>
            <td>{item.remaining}</td>
          </tr>
        ))}
          </tbody>
    )
}
export default Showlist2