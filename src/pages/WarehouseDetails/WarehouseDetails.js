import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import InventoryCard from "../../components/InventoryCard/InventoryCard";
import axios from "axios";

const WareHouseDetails = () => {
  const { warehouseId } = useParams();
  const [warehouse, setWarehouse] = useState("");
  // const [details, setDetails] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8081/warehouse/${warehouseId}`)
      .then((response) => {
        setWarehouse(response.data);
      });
  }, [warehouseId]);

  if (warehouse === "") {
    return <h1>Loading . . .</h1>;
  }

  return (
    <main className="details">
      <section className="warehouse">
        <h1 className="warehouse__name">{warehouse.name}</h1>
        <div className="warehouse__details">
          <span className="warehouse__label">Warehouse Address</span>
          <span className="warehouse__address">{warehouse.address}</span>
        </div>
      </section>
    </main>
  );
};

export default WareHouseDetails;
