function Popup({ isOpen, onClose }) {
  console.log("zxcda",isOpen);
  if (!isOpen) return null;
    return (
      <section id="showdata" className="absolute">
     <div className="flex">
      <div className="bg-white w-80">
        <span className="" onClick={onClose}>
          &times;
        </span>
        <h2>This is a Popup</h2>
        <p>This is the popup content.</p>
      </div>
    </div>
    </section>
 );
}
export default Popup