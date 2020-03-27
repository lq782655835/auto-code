{{##def.capitalizeName:{{=it.server.conflict+it.name.charAt(0).toUpperCase()+it.name.slice(1)}}#}}

{{##def.allList:get{{#def.capitalizeName}}List#}}
{{##def.detail:get{{#def.capitalizeName}}DetailById#}}
{{##def.del:del{{#def.capitalizeName}}ById#}}
{{##def.create:create{{#def.capitalizeName}}#}}
{{##def.update:update{{#def.capitalizeName}}#}}

import http from '../http'

// 列表
export const {{#def.allList}} = data =>
    http({
        url: `{{=it.server.prefix}}/list`,
        method: 'get',
        data
    })

// 详情
export const {{#def.detail}} = id =>
    http({
        url: `{{=it.server.prefix}}/${id}`,
        method: 'get'
    })

// 删除单条
export const {{#def.del}} = id =>
    http({
        url: `{{=it.server.prefix}}/${id}`,
        method: 'delete'
    })

// 创建
export const {{#def.create}} = data =>
    http({
        url: `{{=it.server.prefix}}`,
        method: 'post',
        data
    })

// 更新
export const {{#def.update}} = (id, data) =>
    http({
        url: `{{=it.server.prefix}}/${id}`,
        method: 'put',
        data
    })
