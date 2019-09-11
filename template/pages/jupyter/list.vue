{{##def.capitalizeName:{{=it.server.conflict+it.name.charAt(0).toUpperCase()+it.name.slice(1)}}#}}

{{##def.list1:get{{#def.capitalizeName}}List#}}
{{##def.detail:get{{#def.capitalizeName}}DetailById#}}
{{##def.del:del{{#def.capitalizeName}}ById#}}
{{##def.create:create{{#def.capitalizeName}}#}}
{{##def.update:update{{#def.capitalizeName}}#}}
<template>
    <u-layout dir="v">
        <u-page-filter :filterList="queryConfig" :query.sync="condition" @handleClick="handleClick">
        </u-page-filter>
        <u-page-table
            :data="list"
            :loading="loading"
            :fieldList="tableConfig.fieldList"
            :handle="tableConfig.handle"
            @handleClick="handleClick"
        >
            <el-pagination
                background
                layout="total, prev, pager, next"
                :page-size="pageSize"
                :current-page.sync="page"
                @current-change="refreshCurrentPage"
                :total="total"
            />
        </u-page-table>
    </u-layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListMixin from '@/components/mixins/list'
import { {{#def.list1}}, {{#def.del}} } from '@/server'
import ModifyDialog from './components/modify-dialog.vue'

@Component
export default class {{#def.capitalizeName}} extends Mixins(ListMixin) {
    listService = {{#def.list1}}
    condition = {{=JSON.stringify(it.filterConfig.condition)}}

    // 筛选框配置
    get queryConfig() {
        return {{=JSON.stringify(it.filterConfig.query)}}
    }

    // 表格配置
    get tableConfig() {
        return {{=JSON.stringify(it.tableConfig)}}
    }

    // 事件处理
    handleClick(event, data) {
        const eventMethodMap = {
            search: this.refresh, // 查询
            create: this.createRow, // 创建
            update: this.editRow, // 修改
            delete: this.delRow // 删除
        }
        return eventMethodMap[event](data)
    }

    createRow() {
        this.$openDialog(ModifyDialog)().then(() => this.doneSuccessOperation('创建{{=it.cnName}}成功'))
    }

    editRow({ id }) {
        this.$openDialog(ModifyDialog)({id}).then(() => this.doneSuccessOperation('更新{{=it.cnName}}成功'))
    }

    delRow({ id }) {
        {{#def.del}}(id).then(() => this.refreshCurrentPage())
    }
}
</script>

<style lang="scss" scoped></style>
