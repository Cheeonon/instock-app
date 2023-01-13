import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import InventoryCard from "../../components/InventoryCard/InventoryCard";
import sort from "../../assets/icons/sort-24px.svg";
import CloseLogo from "../../assets/icons/close-24px.svg";
import "./Inventory.scss";
import { useParams, useNavigate } from "react-router-dom";

const Inventory = () => {
  const [inventories, setInventories] = useState(null);
  const { inventoryid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8081/inventory").then((response) => {
      setInventories(response.data);
    });
  }, []);

  if (!inventories) {
    return <h1>Loading...</h1>;
  }

  const handleAddClick = () => {
    navigate("/inventory/add");
  };

  const handleCancelClick = () => {
    document.body.classList.remove("hidden__active");
    navigate("/inventory");
  };

  const handleDeleteClick = (inventoryid) => {
    axios
      .delete(`http://localhost:8081/inventory/${inventoryid}`)
      .then((response) => {
        document.body.classList.remove("hidden__active");
        navigate("/inventory");
        return axios.get("http://localhost:8081/inventory");
      })
      .then((response) => {
        setInventories(response.data);
      });
  };

  let overlay = <></>;

  if (inventoryid !== undefined) {
    const item = inventories.find((item) => item.id === inventoryid);
    overlay = (
      <>
        {document.body.classList.add("hidden__active")}
        <div className="overlay__grey"></div>
        <div className="overlay">
          <div className="overlay__text">
            <img
              className="overlay__x"
              src={CloseLogo}
              onClick={handleCancelClick}
              alt="X"
            ></img>
            <h1 className="overlay__header">
              Delete {item.itemName} Inventory Item?
            </h1>
            <p className="overlay__para">
              Please confirm that you'd like to delete {item.itemName} from the
              inventory list. You won't be able to undo this action
            </p>
            <div className="overlay__buttons">
              <button className="cancel" onClick={handleCancelClick}>
                Cancel
              </button>
              <button
                className="delete"
                onClick={() => {
                  handleDeleteClick(inventoryid);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {overlay}
      <main className="inventory">
        <div className="inventory__header">
          <h1 className="inventory__title">Inventory</h1>
          <div className="inventory__wrap">
            <input className="inventory__search" placeholder="Search..." />
            <button className="inventory__add" onClick={handleAddClick}>
              + Add New Item
            </button>
          </div>
        </div>
        <div className="group">
          <div className="group__label">
            <h4>inventory item</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="group__label">
            <h4>category</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="group__label">
            <h4>status</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="group__label">
            <h4>qty</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="group__label">
            <h4>warehouse</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="group__label">
            <h4>actions</h4>
          </div>
        </div>
        <div className="inventory-card">
          {inventories.map((inventory) => {
            return (
              <InventoryCard
                key={inventory.id}
                id={inventory.id}
                itemName={inventory.itemName}
                category={inventory.category}
                status={inventory.status}
                quantity={inventory.quantity}
                warehouseName={inventory.warehouseName}
              />
            );
          })}
        </div>
      </main>
    </>
  );
};

export default Inventory;
