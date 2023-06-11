import "./Dropdown.css"

const Dropdown = ({text, children}) => {
  return (
    <div className="dropdown">
      <button className="dropbtn">
        {text}
        <div className="dropdown-arrow"></div>

      </button>
      <div className="dropdown-content">
        {children}
      </div>
    </div>
  );
}

export default Dropdown;