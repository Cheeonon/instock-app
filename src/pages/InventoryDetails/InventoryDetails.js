import React from 'react'
import ArrowBack from '../../assets/icons/arrow_back-24px.svg'
import Edit from '../../assets/icons/edit-24px.svg'
import './InventoryDetails.scss'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchInventoryById } from '../../utils/api';

const InventoryDetails = () => {

  const [inventoryItem, setInventoryItem] = useState(null);
  const { inventoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventoryById(inventoryId)
      .then((response) => {
        setInventoryItem(response.data);
      })
  }, [inventoryId])

  if (!inventoryItem) {
    return <p>Loading</p>;
  }

 

  const handleEditInventory = () => {
    navigate(`/inventory/${inventoryId}/edit`);
  };
  const handleBack = () => {
    navigate(`/inventory`);
  };

  return (
    <div className="inventory-details">
      <div className="inventory-details-top">
        <div className="inventory-details-top__left">
            <img className="inventory-details__back-button" src={ArrowBack} alt="Arrow Back" onClick={handleBack}/>
          <h1 className="inventory-details__title">{inventoryItem.itemName}</h1>
        </div>
        <div className="inventory-details__edit-button">
            <img className="inventory-details__edit-button-image" src={Edit} alt="Edit Button" onClick={handleEditInventory}/>
        </div>
      </div> 
      <div className="inventory-details__item-info">
        <div className="item-info__left">
          <div className="item-info__left-description">
            <h4 className="inventory-details__label">Item Description:</h4>
            <p className="inventory-details__text">{inventoryItem.description}</p>
          </div>
          <h4 className="inventory-details__label">Category:</h4>
          <p className="inventory-details__text">{inventoryItem.category}</p>
          
        </div>
        <div className='item-info__stock'>
          <div className='item-info__stock-left'>
            <h4 className="inventory-details__label">Status:</h4>
            <div className={inventoryItem.status === "In Stock" ? "inventory-details__stock" : "inventory-details__stock--out-of-stock"}>{inventoryItem.status}</div>
            <h4 className="inventory-details__label">Warehouse:</h4>
            <p className="inventory-details__text">{inventoryItem.warehouseName}</p>
          </div>
          <div className='item-info__stock-right'>
            <h4 className="inventory-details__label">Quantity:</h4>
            <p className="inventory-details__text">{inventoryItem.quantity}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventoryDetails