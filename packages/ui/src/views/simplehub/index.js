import { useEffect, useState } from 'react'

// material-ui
import { Grid } from '@mui/material'

// project imports
import ItemCard from 'ui-component/cards/ItemCard'
import { gridSpacing, baseURL } from 'store/constant'

// API
import marketplacesApi from 'api/marketplaces'

// Hooks
import useApi from 'hooks/useApi'

// ==============================|| Marketplace ||============================== //

const SimpleHub = () => {
    // const theme = useTheme()

    const [isChatflowsLoading, setChatflowsLoading] = useState(true)
    const [images, setImages] = useState({})

    const getAllChatflowsMarketplacesApi = useApi(marketplacesApi.getAllChatflowsMarketplaces)

    useEffect(() => {
        getAllChatflowsMarketplacesApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setChatflowsLoading(getAllChatflowsMarketplacesApi.loading)
    }, [getAllChatflowsMarketplacesApi.loading])

    useEffect(() => {
        if (getAllChatflowsMarketplacesApi.data) {
            try {
                const chatflows = getAllChatflowsMarketplacesApi.data
                const images = {}
                for (let i = 0; i < chatflows.length; i += 1) {
                    const flowDataStr = chatflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[chatflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[chatflows[i].id].includes(imageSrc)) {
                            images[chatflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllChatflowsMarketplacesApi.data])

    return (
        <Grid container spacing={gridSpacing}>
            {!isChatflowsLoading &&
                getAllChatflowsMarketplacesApi.data &&
                getAllChatflowsMarketplacesApi.data.map((data, index) => (
                    <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
                        <ItemCard showPointer={false} data={data} onClick={() => console.log('clicked')} images={images[data.id]} />
                    </Grid>
                ))}
        </Grid>
    )
}

export default SimpleHub
