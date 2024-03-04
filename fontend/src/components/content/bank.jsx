import { useState } from "react"
function Bank(props){
    const [databank, setbank] = useState();
    const dataName =  props.data.bank_name
    
    return (
        <option value={dataName}>{dataName}</option>
    )
}
export default Bank