import axios from 'axios';
const BASE_URL = `https://instock-api-production.up.railway.app`;

export const fetchInventory = () => {
    return axios.get(`${BASE_URL}/inventory/`);
}

export const fetchInventoryById = (inventoryId) => {
    return axios.get(`${BASE_URL}/inventory/${inventoryId}`);
}

export const addInventoryItem = (item) => {
    return axios.post(`${BASE_URL}/inventory/add`, item);
}

export const editInventoryItem = (item) => {
    return axios.put(`${BASE_URL}/inventory/${item.id}/edit`, item);
}

export const fetchWarehouses = () => {
    return axios.get(`${BASE_URL}/warehouse/`);
}

export const addNewWarehouse = (body) => {
    return axios.post(`${BASE_URL}/warehouse/add`, body);
}

export const editWarehouse = (body, warehouseId) => {
    return axios.put(`${BASE_URL}/warehouse/${warehouseId}/edit`, body);
}
