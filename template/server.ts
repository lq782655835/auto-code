import http from '../http'

// 列表
export const get{{name}}ListData = data =>
    http({
        url: `/inference/service/list`,
        method: 'get',
        data
    })

// 详情
export const getDetailById = serviceId =>
    http({
        url: `/inference/service?serviceId=${serviceId}`,
        method: 'get'
    })

// 删除单条
export const delById = serviceId =>
    http({
        url: `/inference/service?serviceId=${serviceId}`,
        method: 'delete'
    })

/** 创建 */
export const create = data =>
    http({
        url: '/inference/service',
        method: 'POST',
        data
    })

// 更新
export const updateService = data =>
    http({
        url: '/inference/service',
        method: 'PUT',
        data
    })
