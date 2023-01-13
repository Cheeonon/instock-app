import React from "react";
import ArrowBack from "../../assets/icons/arrow_back-24px.svg";
import FormRequiredMessage from "../../components/FormRequiredMessage/FormRequiredMessage";
import IsUploaded from "../../components/IsUploaded/IsUploaded";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router-dom";
import {
  fetchInventory,
  fetchWarehouses,
  editInventoryItem,
  fetchInventoryById,
} from "../../utils/api";
import "./EditInventory.scss";


const EditInventory = () => {
  const [isUploaded, setIsUploaded] = useState(false);

  // Object Data States
  const [inventoryData, setInventoryData] = useState(null);
  const [warehousesData, setWarehousesData] = useState(null);
  const [inventoryItem, setInventoryItem] = useState(null);
  // On Change States
  const [itemName, setItemName] = useState(null);
  const [itemDescription, setItemDescription] = useState(null);
  const [itemQuantity, setItemQuantity] = useState(0);
  const [itemAvailability, setItemAvailability] = useState("In Stock");
  // Form Input Validation States
  const [nameValid, setNameValid] = useState(true);
  const [descriptionValid, setDescriptionValid] = useState(true);
  const [categoryValid, setCategoryValid] = useState(true);
  const [quantityValid, setQuantityValid] = useState(true);
  const [warehouseValid, setWarehouseValid] = useState(true);

  const { inventoryId } = useParams();

  // Handle Form Input Value Changes
  const handleStatusSelect = (event) => {
    setItemAvailability(event.target.value);
  };
  const handleItemNameChange = (event) => {
    setItemName(event.target.value);
  }
  const handleItemDescriptionChange = (event) => {
    setItemDescription(event.target.value);
  }
  const handleItemQuantityChange = (event) => {
    setItemQuantity(event.target.value);
  }

  // Handle Form Submit
  const handleEditInventoryItem = (event) => {
    event.preventDefault();
    const warehouse = event.target.warehouse.value;
    const name = event.target.name.value.trim();
    const description = event.target.description.value.trim();
    const category = event.target.category.value;
    const status = event.target.status.value;
    const quantity = event.target.quantity.value;

    // Reset Form Input Validations to True upon submit
    setNameValid(true);
    setDescriptionValid(true);
    setCategoryValid(true);
    setQuantityValid(true);
    setWarehouseValid(warehouseValid);
    setWarehouseValid(true);

    const item = {
      id: inventoryId,
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
    if (itemAvailability === "In Stock" && itemQuantity <= 0) {
      setQuantityValid(false);
    }
    if (itemAvailability === "Out of Stock" && itemQuantity < 0) {
      setQuantityValid(false);
    }
    if (!warehouse) {
      setWarehouseValid(false);
    }
    if (
      inventoryId &&
      warehouse &&
      name &&
      description &&
      category &&
      status &&
      ((itemAvailability === "In Stock" && itemQuantity > 0) || (itemAvailability === "Out of Stock" && itemQuantity === 0))
      
    ) {
      window.scrollTo(0, 0);
      editInventoryItem(item).then(() => {
        setIsUploaded(true);
      });
    } else {
      console.log("Item has not been edited");
    }
  };

  const handleUploadAgain = () => {
    setIsUploaded(!isUploaded);
  }

  useEffect(() => {
    fetchInventory()
      .then((response) => {
        setInventoryData(response.data);
        return fetchWarehouses();
      })
      .then((response) => {
        setWarehousesData(response.data);
        return fetchInventoryById(inventoryId);
      })
      .then((response) => {
        setInventoryItem(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [itemAvailability, inventoryId]);

  // States must be populated before loading page
  if (!inventoryData || !warehousesData || !inventoryItem) {
    return <p>Loading</p>;
  }

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
  
  // Render elements & components
  return (
    <div className="add-edit-inventory">
      {isUploaded && <IsUploaded handleUploadAgain={handleUploadAgain} btnText="Update Another Information" modalText="Inventory Updated!"/>}
      <div className="add-edit-inventory-top">
        <Link to="/inventory">
          <img
            className="add-edit-inventory__back-button"
            src={ArrowBack}
            alt="Arrow Back"
          />
        </Link>
        <h1 className="add-edit-inventory__title">Edit Inventory Item</h1>
      </div>
      <form
        className="add-edit-inventory__form"
        onSubmit={handleEditInventoryItem}
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
              onChange={handleItemNameChange}
              defaultValue= {itemName || inventoryItem.itemName}
            />
            {!nameValid && <FormRequiredMessage />}
            <label className="form__label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={descriptionValid ? "form__textarea" : "form__textarea--invalid"}
              placeholder="Please enter a brief item description..."
              onChange={handleItemDescriptionChange}
              defaultValue={itemDescription || inventoryItem.description}
            />
            {!descriptionValid && <FormRequiredMessage />}
            <label className="form__label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              className={categoryValid ? "form__input" : "form__input--invalid"}
              defaultValue={inventoryItem.category}
            >
              <option value="default" disabled>
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
              defaultValue={itemQuantity || inventoryItem.quantity}
            />
            {!quantityValid && <FormRequiredMessage />}
            <label className="form__label" htmlFor="warehouse">
              Warehouse
            </label>
            <select
              id="warehouse"
              name="warehouse"
              className="form__input"
              defaultValue={inventoryItem.warehouseName}
            >
              <option value="default" disabled>
                Please Select
              </option>
              {filteredWarehousesArray.map((warehouse) => (
                <option key={uuidv4()} value={warehouse}>
                  {warehouse}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form__bottom">
          <Link to="/inventory">
            <button className="form__button--cancel">
              Cancel
            </button>
          </Link>
          <button className="form__button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInventory;
