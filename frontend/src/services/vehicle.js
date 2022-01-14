
import api from './apiHandler'

export async function addVehicle(data) {
    let apiConfig = {}
    apiConfig.url = `vehicle`
    apiConfig.type = 'POST'
    apiConfig.body = data
    apiConfig.multipart = true
    return await api(apiConfig)
}

export async function updateVehicle(data) {
    let apiConfig = {}
    apiConfig.url = `vehicle`
    apiConfig.type = 'PUT'
    apiConfig.body = data
    return await api(apiConfig)
}

export async function deleteVehicle(id) {
    let apiConfig = {}
    apiConfig.url = `vehicle?id=${id}`
    apiConfig.type = 'DELETE'
    apiConfig.body = null
    return await api(apiConfig)
}

export async function getAllVehicles() {
    let apiConfig = {}
    apiConfig.url = `vehicle`
    apiConfig.type = 'GET'
    apiConfig.body = null
    return await api(apiConfig)
}
