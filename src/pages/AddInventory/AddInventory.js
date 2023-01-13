import React from "react";
import ArrowBack from "../../assets/icons/arrow_back-24px.svg";
import FormRequiredMessage from "../../components/FormRequiredMessage/FormRequiredMessage";
import IsUploaded from "../../components/IsUploaded/IsUploaded";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {Link } from "react-router-dom";
import { fetchInventory, fetchWarehouses ,addInventoryItem } from "../../utils/api";
import "./AddInventory.scss";

const AddInventory = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  // Object Data States
  const [inventoryData, setInventoryData] = useState(null);
  const [warehousesData, setWarehousesData] = useState(null);
  const [itemAvailability, setItemAvailability] = useState("In Stock");
  const [itemQuantity,  setItemQuantity] = useState("Not Filled");
  // Form Input Validation States
  const [nameValid, setNameValid] = useState(true);
  const [descriptionValid, setDescriptionValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const [quantityValid, setQuantityValid] = useState(true);
  const [warehouseValid, setWarehouseValid] = useState(true);

  const handleUploadAgain = () => {
    setIsUploaded(!isUploaded);
};

  // Handle Item Availability Status when selected (Radio Button)
  const handleStatusSelect = (event) => {
    setItemAvailability(event.target.value);
  };
    // Handle Item Quantity Change
  const handleItemQuantityChange = (event) => {
    setItemQuantity(event.target.value);
  };

  const handleAddInventoryItem = (event) => {
    event.preventDefault();
    const warehouse = event.target.warehouse.value;
    const name = event.target.name.value.trim();
    const description = event.target.description.value.trim();
    const category = event.target.category.value;
    const status = event.target.status.value;
    const quantity = event.target.quantity.value;
    setNameValid(true);
    setDescriptionValid(true);
    setCategoryValid(true);
    setQuantityValid(itemQuantity);
    setQuantityValid(true);
    setWarehouseValid(true);

    const item = {
      warehouseName: warehouse,
      itemName: name,
      description: description,
      category: category,
      status: status,
      quantity: quantity,
    };

    // Form input validation
    if (!name) {
      setNameValid(false);
    }
    if (!description) {
      setDescriptionValid(false);
    }
    if (!category) {
      setCategoryValid(false);
    }
    if ((itemAvailability === "In Stock" && quantity <= 0) || !quantity) {
      setQuantityValid(false);
    }
    if (!warehouse) {
      setWarehouseValid(false);
    }
    if (
      warehouse &&
      name &&
      description &&
      category &&
      status &&
      ((itemAvailability === "In Stock" && quantity > 0) || (itemAvailability === "Out of Stock" && quantity === 0))
    ) {
      window.scrollTo(0, 0);
      addInventoryItem(item).then(() => {
        // Add Success Module Here
        setIsUploaded(true);
      });
    } else {
      // Add Failed Module Here
      console.log("Item has not been edited");
    }
  };

  useEffect(() => {
    fetchInventory()
      .then((response) => {
        setInventoryData(response.data);
        return fetchWarehouses();
      })
      .then((response) => {
        setWarehousesData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [itemAvailability]);

  if (!inventoryData || !warehousesData) {
    return <p>Loading</p>;
  };

  // Get all inventory items and their categories, then remove duplicates to get a up to date category list
  const categoryArray = inventoryData.map((item) => {
    return item.category;
  });
  let filteredCategoryArray = [...new Set(categoryArray)];

  // Get all warehouses and their names, then remove duplicates to get a up to date warehouses list
  const warehousesArray = warehousesData.map((warehouse) => {
    return warehouse.name;
  });
  let filteredWarehousesArray = [...new Set(warehousesArray)];

  return (
    <div className="add-edit-inventory">
      {isUploaded && <IsUploaded handleUploadAgain={handleUploadAgain} btnText="Add Another Inventory" modalText="Inventory Added!"/>}
      <div className="add-edit-inventory-top">
        <Link to="/inventory">
          <img
            className="add-edit-inventory__back-button"
            src={ArrowBack}
            alt="Arrow Back"
          />
        </Link>
        <h1 className="add-edit-inventory__title">Add New Inventory Item</h1>
      </div>
      <form
        className="add-edit-inventory__form"
        onSubmit={handleAddInventoryItem}
      >
        <div className="form__main">
          <div className="form__item-details">
            <h2 className="form__title">Item Details</h2>
            <label className="form__label" htmlFor="name">
              Item Name
            </label>
            <input
              id="name"
              name="name"
              className={nameValid ? "form__input" : "form__input--invalid"}
              type="text"
              placeholder="Item Name"
            />
            {!nameValid && <FormRequiredMessage />}
            <label className="form__label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={
                descriptionValid ? "form__textarea" : "form__textarea--invalid"
              }
              placeholder="Please enter a brief item description..."
            />
            {!descriptionValid && <FormRequiredMessage />}
            <label className="form__label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className={categoryValid ? "form__input" : "form__input--invalid"}
              defaultValue=""
            >
              <option value="" disabled>
                Please Select
              </option>
              {filteredCategoryArray.map((item) => (
                <option key={uuidv4()} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {!categoryValid && <FormRequiredMessage />}
          </div>
          <div className="form__item-availability">
            <h2 className="form__title">Item Availability</h2>
            <p className="form__label">Status</p>
            <div>
              <input
                type="radio"
                id="in-stock"
                name="status"
                value="In Stock"
                defaultChecked
                onChange={handleStatusSelect}
              />
              <label htmlFor="in-stock">In stock</label>
            </div>
            <div>
              <input
                type="radio"
                id="out-of-stock"
                name="status"
                value="Out of Stock"
                onChange={handleStatusSelect}
              />
              <label htmlFor="out-of-stock">Out of stock</label>
            </div>
            <label
              className={
                itemAvailability === "In Stock"
                  ? "form__label"
                  : "form__label--hidden"
              }
              htmlFor="quantity"
            >
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              className={
                itemAvailability === "In Stock"
                  ? quantityValid ? "form__input" : "form__input--invalid" 
                  : "form__input--hidden"
              }
              type="number"
              onChange={handleItemQuantityChange}
              placeholder="0"
            />
            {!quantityValid && <FormRequiredMessage />}

            <label className="form__label" htmlFor="warehouse">
              Warehouse
            </label>
            <select
              id="warehouse"
              name="warehouse"
              className={
                warehouseValid ? "form__input" : "form__input--invalid"
              }
              defaultValue=""
            >
              <option value="" disabled>
                Please select
              </option>
              {filteredWarehousesArray.map((warehouse) => (
                <option key={uuidv4()} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </select>
            {!warehouseValid && <FormRequiredMessage />}
          </div>
        </div>

        <div className="form__bottom">
          <Link to="/inventory">
            <button className="form__button--cancel">
              Cancel
            </button>
          </Link>
          <button className="form__button" type="submit">
            + Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInventory;
