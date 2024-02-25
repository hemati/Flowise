import client from './client'

const getAllChatflowsMarketplaces = () => client.get('/marketplaces/chatflows')
const getAllChatflowsMarketplacesNew = () => client.get('/marketplaces/templates')
const getAllToolsMarketplaces = () => client.get('/marketplaces/tools')
const getAllTemplatesFromMarketplaces = () => client.get('/marketplaces/templates')

export default {
    getAllChatflowsMarketplaces,
    getAllToolsMarketplaces,
    getAllTemplatesFromMarketplaces,
    getAllChatflowsMarketplacesNew
}
