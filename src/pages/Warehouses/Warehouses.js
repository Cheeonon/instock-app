import React from 'react'
import axios from "axios"
import { useEffect, useState } from 'react'
import ItemCard from '../../components/ItemCard/ItemCard'
import SortLogo from "../../assets/icons/sort-24px.svg"
import "./Warehouses.scss"
import { useParams, useNavigate } from 'react-router-dom'
import CloseLogo from "../../assets/icons/close-24px.svg"
import Magnify from "../../assets/icons/search-24px.svg"
const Warehouses = () => {

  const [items, setItems] = useState(null)
  const {warehouseid} = useParams()
  const navigate = useNavigate()
  

  useEffect (()=>{
    axios.get("https://instock-api-production.up.railway.app/warehouse")
      .then((response)=>{
        setItems(response.data)
      })
  },[])

 

  const handleAddClick = () => {
    document.body.classList.remove("hidden__active")
    navigate("/warehouses/add")
  }

  const handleCancelClick = () => {
    document.body.classList.remove("hidden__active")
    navigate("/warehouses")
  }

  const handleDeleteClick = (warehouseid) => {
    axios.delete(`https://instock-api-production.up.railway.app/warehouse/${warehouseid}`)
      .then ((response)=>{  
        document.body.classList.remove("hidden__active")
        navigate("/warehouses")
        return axios.get("https://instock-api-production.up.railway.app/warehouse")
      })
      .then ((response)=>{
        setItems(response.data)
      })
  
  }

  if (!items) {
    return <h1>Loading . . .</h1>
  }
  
  let overlay = <></>

  if (warehouseid !== undefined) {
    const item = items.find((item)=> item.id === warehouseid)
    overlay =
      <>
        {document.body.classList.add("hidden__active")}
        <div className='overlay__grey'></div>
        <div className='overlay'>
          <div className='overlay__text'>
            <img className="overlay__x" src={CloseLogo} onClick={handleCancelClick} alt="X"></img>
            <h1 className='overlay__header'>Delete {item.name} Warehouse?</h1>
            <p className='overlay__para'>Please confirm that you'd like to delete {item.name} from the list of warehouses. You won't be able to undo this action</p>
            <div className='overlay__buttons'>
              <button className='cancel' onClick={handleCancelClick}>Cancel</button>
              <button  className='delete' onClick={()=>{handleDeleteClick(warehouseid)}}>Delete</button>
            </div>
          </div>
        </div>
      </>
      
  }
 
  return (
    <div className='main__container'>
      {overlay}
      <main className="items">
        <div className="items__header">
          <h1 className='items__header--title'>Warehouses</h1>
          <div className="item__subhead">
            <input className="item__search" placeholder='Search . . .'/>
            <img className="item__search--img" src={Magnify} alt="magnifying glass"></img>
            <button className="item__button" onClick={handleAddClick}>+ Add New Warehouse</button>
          </div>
        </div>
        <div className="label__holder">
          <div className="label__holder--title">WAREHOUSE
            <img alt="sort" className="sort__logo" src={SortLogo} ></img>
          </div>
          <div className="label__holder--title">ADDRESS
            <img alt="sort" className="sort__logo" src={SortLogo} ></img>
          </div>
          <div className="label__holder--title">CONTACT NAME
            <img alt="sort" className="sort__logo" src={SortLogo} ></img>
          </div>
          <div className="label__holder--title">CONTACT INFORMATION
            <img alt="sort" className="sort__logo" src={SortLogo} ></img>
          </div>
          <div className="label__holder--title">ACTIONS
          </div>
        </div>
        <div className="item-card">
        {items.map((item)=>{
          return (
            <div className='itemcard__holder' key={item.id}>
              <ItemCard
                
                id={item.id}
                name={item.name}
                address={item.address}
                city={item.city}
                country={item.country}
                contactName={item.contact.name}
                contactEmail={item.contact.email}
                contactPhone={item.contact.phone}
              />
            </div>
          )
        })}
        </div>
      </main>
    </div>
  )
    
  
}

export default Warehouses