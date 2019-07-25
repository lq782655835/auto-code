<template>
    <u-layout dir="v">
        <el-table :data="list" border stripe style="width: 98%">
            {{~it.list.tableConfig :item:index}}
            <el-table-column prop="{{=item.prop}}" label="{{=item.label}}" width="{{=item.width}}" />
            {{~}}
            <el-table-column prop="gmtUpdate" label="更新时间" width="160px">
                <template slot-scope="scope">
                    {{ scope.row.gmtUpdate | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="服务操作" width="240px">
                <template slot-scope="scope">
                    <u-layout gap="s">
                        <el-link type="primary" @click="debugOnline(scope.row)">在线调试</el-link>
                        <el-link
                            type="primary"
                            @click="openUpdateModelDialog(scope.row)"
                            :disabled="disabledOperation(scope.row, 'editModel')"
                            >更新模型</el-link
                        >
                        <el-link
                            type="primary"
                            @click="openUpdateServiceDialog(scope.row)"
                            :disabled="disabledOperation(scope.row, 'editService')"
                            >扩缩容</el-link
                        >
                        <el-link
                            type="primary"
                            @click="viewRow(scope.row)"
                            :disabled="disabledOperation(scope.row, 'view')"
                            >查看</el-link
                        >
                        <el-link
                            type="danger"
                            @click="delRow(scope.row)"
                            :disabled="disabledOperation(scope.row, 'delete')"
                            >删除</el-link
                        >
                    </u-layout>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :current-page.sync="page"
            @current-change="refreshCurrentPage"
            :total="total"
        >
        </el-pagination>
    </u-layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListMixin from '@/mixins/list'
import ModifyDialog from '@/components/model/modify-dialog.vue'
import { get{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}}List,
    del{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}}ById } from '@/server'

@Component
export default class Model extends Mixins(ListMixin) {
    listService = get{{=it.name.charAt(0).toUpperCase()+it.name.slice(1)}}List
}
</script>

<style lang="scss" scoped></style>
