import { useState } from "react"
function Showlist(props){
    const dataName = props.data.data
    const datakey = props.value
    const datapaymet = props.payment
    
    
    //const dataName =  props.data
    //const [datashow, setdatashow] = useState([])
    console.log("mmm",props);
    console.log("ooo",dataName);
   // console.log("ggg",ter);
    console.log("gunvv",datapaymet);

    
    let tii = []
    //let ter = [tii,datapaymet]
    //let tii2 = datapaymet
    for(let key in dataName){
        //let tii = []
        let tiichek = dataName[key]
        if(key == datakey){
            console.log("lll",key);
            console.log("hhh",tiichek);
            //tiichek.datapaymet = datapaymet
            tii = tiichek
            
            
            //setdatashow(tiichek)
        }
        
        //console.log("uuuu",tii);
        //console.log("fff",datashow);
        
    }
    //console.log("iloveyou",myVariable);
    //console.log("vvvv",tii);
    if (!dataName) {
        // Handle the case where data is not defined or null
        return null;
      }
    
    return (
        <tbody>
        {tii.map((item,index) => (
          <tr key={index}>
            <td className="text-center">{item.year}</td>
            <td className="text-center">{item.month}</td>
            <td className="text-center">{Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(datapaymet)}</td>
            <td className="text-center">{Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(item.interest.toFixed(2))}</td>
            <td className="text-center">{Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(item.balance.toFixed(2))}</td>
            <td className="text-center">{Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(item.overpayment.toFixed(2))}</td>
            <td className="text-center">{Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
}).format(item.remaining)}</td>
            
          </tr>
        ))}
          </tbody>
    )
}
export default Showlist