
import api from "./apiHandler";

export async function dashboardData() {
    let apiConfig = {}
    apiConfig.url = `dashboard`
    apiConfig.type = 'GET'
    apiConfig.body = null
    return await api(apiConfig)
}
