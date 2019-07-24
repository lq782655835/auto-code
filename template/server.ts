import http from '../http'

// 列表
export const get{{name}}List = data =>
    http({
        url: `/inference/service/list`,
        method: 'get',
        data
    })

// 详情
export const get{{name}}DetailById = id =>
    http({
        url: `/inference/service?id=${id}`,
        method: 'get'
    })

// 删除单条
export const del{{name}}ById = id =>
    http({
        url: `/inference/service?id=${id}`,
        method: 'delete'
    })

// 创建
export const create{{name}} = data =>
    http({
        url: '/inference/service',
        method: 'POST',
        data
    })

// 更新
export const update{{name}} = data =>
    http({
        url: '/inference/service',
        method: 'PUT',
        data
    })
