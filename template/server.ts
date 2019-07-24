import http from '../http'

// 列表
export const get{{=it.name.toUpperCase()}}List = data =>
    http({
        url: `/inference/service/list`,
        method: 'get',
        data
    })

// 详情
export const get{{=it.name}}DetailById = id =>
    http({
        url: `/inference/service?id=${id}`,
        method: 'get'
    })

// 删除单条
export const del{{=it.name}}ById = id =>
    http({
        url: `/inference/service?id=${id}`,
        method: 'delete'
    })

// 创建
export const create{{=it.name}} = data =>
    http({
        url: '/inference/service',
        method: 'POST',
        data
    })

// 更新
export const update{{=it.name}} = data =>
    http({
        url: '/inference/service',
        method: 'PUT',
        data
    })
