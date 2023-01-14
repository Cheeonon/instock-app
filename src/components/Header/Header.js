import "./Header.scss";
import logo from "../../assets/logo/InStock-Logo_2x.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {

  const [active, setActive] = useState(null);

  useEffect(()=>{
    if(window.location.pathname.includes("inventory")){
      setActive("inventory");
    } else{
      setActive("warehouses");
    }
  }, [])

  const handleActive = (item) => {
    setActive(item);
  }

  return (
    <header>
      <nav className="header">
        <Link to="/">
          <img className="header__logo" src={logo} alt="instock-logo" />
        </Link>
        <div className="header__buttons">
          <Link to="/warehouses" className={active === "warehouses" ? "header__btn header__btn--active" : "header__btn"} onClick={handleActive}>
            Warehouses
          </Link>
          <Link to="/inventory" className={active === "inventory" ? "header__btn header__btn--active" : "header__btn"} onClick={handleActive}>
            Inventory
          </Link>
        </div>
      </nav>
    </header>
  );
}
 
export default Header;
