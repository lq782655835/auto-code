import http from '../http'

// 列表
export const get{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}}List = data =>
    http({
        url: `/inference/service/list`,
        method: 'get',
        data
    })

// 详情
export const get{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}}DetailById = id =>
    http({
        url: `/inference/service?id=${id}`,
        method: 'get'
    })

// 删除单条
export const del{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}}ById = id =>
    http({
        url: `/inference/service?id=${id}`,
        method: 'delete'
    })

// 创建
export const create{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}} = data =>
    http({
        url: '/inference/service',
        method: 'POST',
        data
    })

// 更新
export const update{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}} = data =>
    http({
        url: '/inference/service',
        method: 'PUT',
        data
    })
