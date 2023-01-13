import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InventoryCard from "../../components/InventoryCard/InventoryCard";
import axios from "axios";
import { fetchInventory } from "../../utils/api";
import "./WarehouseDetails.scss"
import Back from "../../assets/icons/arrow_back-24px.svg"
import Edit from "../../assets/icons/edit-24px-white.svg"
import sort from "../../assets/icons/sort-24px.svg";
import "./WarehouseDetails.scss";

const WareHouseDetails = () => {
  const { warehouseId } = useParams();
  const [warehouse, setWarehouse] = useState("");
  const [inventories, setInventories] = useState("");

  const navigate = useNavigate()

  const handleCancelClick = () => {
    navigate(`/warehouses`)
  }

  const handleEditClick = () => {
    navigate(`/warehouses/${warehouseId}/edit`)
  }

  useEffect(() => {
    axios
      .get(`https://instock-api-production.up.railway.app/warehouse/${warehouseId}`)
      .then((response) => {
        setWarehouse(response.data);
        return fetchInventory();
      })
      .then((response) => {
        setInventories(response.data);
      });
  }, [warehouseId]);

  if (warehouse === "" || inventories === "") {
    return <h1>Loading . . .</h1>;
  }

  return (
    <main className="details">
      <section className="warehouse">
        <div className="ware__holder">
          <div className="heading">
            <img className="heading__img" src={Back} alt="back" onClick={handleCancelClick}></img>
            <h1 className="warehouse__name">{warehouse.name}</h1>
            <div className="heading__button--holder">
              <img className="heading__edit" src={Edit} alt="edit" onClick={handleEditClick}></img>
              <span className="heading__tablet">Edit</span>
            </div>
          </div>
          <div className="warehouse__card">
            <div className="warehouse__address">
              <div className="ware__column">
                <span className="ware__label">WAREHOUSE ADDRESS:</span>
              </div>
              <div>
                <span className="ware__info">{warehouse.address},&nbsp;</span>
                <span className="ware__info">{warehouse.city},&nbsp;</span>
                <span className="ware__info">{warehouse.country}</span>
              </div>
            </div>
            <div className="warehouse__sub">
              <div className="warehouse__contacts">
                <span className="ware__label">CONTACT NAME:</span>
                <span className="ware__info">{warehouse.contact.name}</span>
                <span className="ware__info">{warehouse.contact.position}</span>
              </div>
              <div className="warehouse__contacts">
                <span className="ware__label">CONTACT INFORMATION:</span>
                <span className="ware__info">{warehouse.contact.phone}</span>
                <span className="ware__info">{warehouse.contact.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="category">
          <div className="category__label category__label--item">
            <h4>inventory item</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="category__label category__label--category">
            <h4>category</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="category__label category__label--status">
            <h4>status</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="category__label category__label--qty">
            <h4>qty</h4>
            <img className="arrow" src={sort} alt="arrow" />
          </div>
          <div className="category__label category__label--actions">
            <h4>actions</h4>
          </div>
        </div>
        <div className="inventory-items">
          {inventories.map((inventory) => {
            if (warehouseId === inventory.warehouseID) {
              return (
                <InventoryCard
                  key={inventory.id}
                  id={inventory.id}
                  itemName={inventory.itemName}
                  category={inventory.category}
                  status={inventory.status}
                  quantity={inventory.quantity} 
                />
              );
            } else{
              return null;
            }
          })}
        </div>
      </section>
    </main>
  );
};

export default WareHouseDetails;
