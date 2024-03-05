import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./content.css"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import Imagelogo from "../../../public/image/—Pngtree—balance scales or of justice_8539698.png"
function Content(props){
    console.log(props);
    return (
        <section className="flex flex-col bg-background-image bg-cover min-h-dvh snap-start ">
            <div>
            <div className="flex justify-between  max-w-screen-xl mx-auto  flex-wrap ">
            <div className="mt-14">
            <h1 className="text-[80px] text-black font-bold font-sans protest-riot-regular  ">Our Future <br/> Home  </h1><br />
            <p className="text-orange-600  text-lg">In order to have a home,a fmaily, <br/>
            Financial security, and to ac achieve <br/>
            one's dreams</p>
            </div>
            <div className="mask mask-diamond bg-white mt-9   ">
                <a href="#calculator"><img className="w-[450px] " src="../../../public/image/—Pngtree—balance scales or of justice_8539698.png" alt="" /></a>
            </div>
            </div>
            </div>
            
            <div className="flex justify-center mt-52 animate-bounce"><a href="#calculator"><img src="../../../public/image/arrowdown1.png" alt="" className="w-28" /></a></div>
            
           
        </section>
    )
}
export default Content