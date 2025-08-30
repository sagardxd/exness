import apiCaller from "./api.service"

export const getLivePrice = async() => {
    const data = apiCaller.get('/')
}