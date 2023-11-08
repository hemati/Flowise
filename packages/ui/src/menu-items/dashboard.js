// assets
import { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconLock, IconBrandDiscord, IconBook, IconRobot } from '@tabler/icons'

// constant
const icons = { IconHierarchy, IconBuildingStore, IconKey, IconTool, IconLock, IconBrandDiscord, IconBook, IconRobot }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: '',
    type: 'group',
    children: [
        {
            id: 'chatflowsitem',
            title: 'Chatflows',
            type: 'item',
            url: '/chatflows',
            icon: icons.IconHierarchy,
            breadcrumbs: true
        },
        {
            id: 'marketplaces',
            title: 'Hub',
            type: 'item',
            url: '/marketplaces',
            icon: icons.IconBuildingStore,
            breadcrumbs: true
        },
        {
            id: 'tools',
            title: 'Tools',
            type: 'item',
            url: '/tools',
            icon: icons.IconTool,
            breadcrumbs: true
        },
        // {
        //     id: 'assistants',
        //     title: 'Assistants',
        //     type: 'item',
        //     url: '/assistants',
        //     icon: icons.IconRobot,
        //     breadcrumbs: true
        // },
        {
            id: 'credentials',
            title: 'Credentials',
            type: 'item',
            url: '/credentials',
            icon: icons.IconLock,
            breadcrumbs: true
        },
        {
            id: 'apikey',
            title: 'API Keys',
            type: 'item',
            url: '/apikey',
            icon: icons.IconKey,
            breadcrumbs: true
        },
        {
            id: 'docs',
            title: 'Docs',
            type: 'item',
            url: 'https://docs.langflux.space',
            icon: icons.IconBook,
            target: '_blank',
            external: true
        },
        {
            id: 'discord',
            title: 'Discord',
            type: 'item',
            url: 'https://discord.gg/PTb8rEGzGz',
            icon: icons.IconBrandDiscord,
            target: '_blank',
            external: true
        }
    ]
}

export default dashboard
