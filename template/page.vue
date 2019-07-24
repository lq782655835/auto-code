<template>
    <u-layout dir="v">
        <el-button type="primary" @click="openNewModelDialog">模型上传部署</el-button>
        <el-table :data="list" border stripe style="width: 98%">
            <el-table-column prop="id" label="ID" width="50px" />
            <el-table-column prop="serviceName" label="服务名称" />
            <el-table-column prop="status" label="服务状态">
                <template slot-scope="scope">
                    {{ scope.row.status }}
                    <el-tooltip
                        v-if="scope.row.errorMsg"
                        :content="scope.row.errorMsg"
                        placement="top"
                    >
                        <i class="el-icon-warning-outline" style="color:red;"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="resourceType" label="资源类型" width="80px" />
            <el-table-column prop="singleCopyResource" label="占用资源">
                <template slot-scope="scope">
                    {{ getResourceText(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column prop="runTime" label="运行时间" />
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
import DetailDialog from '@/components/model/detail-dialog.vue'
import { getListData, delById } from '@/server'
import { MODEL_STATUS_MAP, MODEL_RESOURCE_TYPE_MAP } from '@/utils/config'

// 按钮禁用根据status状态而定，true代表禁用，false代表不禁用
const OperationDisabled = {
    editModel: {
        [MODEL_STATUS_MAP.CREATING]: true,
        [MODEL_STATUS_MAP.CREATE_FAIL]: true,
        [MODEL_STATUS_MAP.AVALIABLE]: false,
        [MODEL_STATUS_MAP.PENDING]: true,
        [MODEL_STATUS_MAP.WAITING]: true,
        [MODEL_STATUS_MAP.ERROR]: true,
        [MODEL_STATUS_MAP.UPDATING]: true,
        [MODEL_STATUS_MAP.UPDATE_FAIL]: false
    },
    editService: {
        [MODEL_STATUS_MAP.CREATING]: true,
        [MODEL_STATUS_MAP.CREATE_FAIL]: true,
        [MODEL_STATUS_MAP.AVALIABLE]: false,
        [MODEL_STATUS_MAP.PENDING]: true,
        [MODEL_STATUS_MAP.WAITING]: true,
        [MODEL_STATUS_MAP.ERROR]: true,
        [MODEL_STATUS_MAP.UPDATING]: true,
        [MODEL_STATUS_MAP.UPDATE_FAIL]: true
    },
    view: {
        [MODEL_STATUS_MAP.CREATING]: true,
        [MODEL_STATUS_MAP.CREATE_FAIL]: true,
        [MODEL_STATUS_MAP.AVALIABLE]: false,
        [MODEL_STATUS_MAP.PENDING]: true,
        [MODEL_STATUS_MAP.WAITING]: true,
        [MODEL_STATUS_MAP.ERROR]: true,
        [MODEL_STATUS_MAP.UPDATING]: true,
        [MODEL_STATUS_MAP.UPDATE_FAIL]: true
    },
    delete: {
        [MODEL_STATUS_MAP.CREATING]: true,
        [MODEL_STATUS_MAP.CREATE_FAIL]: false,
        [MODEL_STATUS_MAP.AVALIABLE]: false,
        [MODEL_STATUS_MAP.PENDING]: false,
        [MODEL_STATUS_MAP.WAITING]: false,
        [MODEL_STATUS_MAP.ERROR]: false,
        [MODEL_STATUS_MAP.UPDATING]: true,
        [MODEL_STATUS_MAP.UPDATE_FAIL]: false
    }
}

// 计算资源总数
export const formatModelResourceTotal = ({ singleCopyResource, copyNumber, resourceType }) => {
    let [first, second, third] = singleCopyResource.split('-').map(str => Number(str) * copyNumber)
    if (resourceType === MODEL_RESOURCE_TYPE_MAP.CPU) {
        return `${first}核${second}G`
    } else {
        return `${first}卡${second}核${third}G`
    }
}

@Component
export default class Model extends Mixins(ListMixin) {
    listService = getListData

    mounted() {
        let t = setInterval(() => this.refresh(), 5000)
        this.$once('hook:beforeDestroy', () => {
            clearInterval(t)
        })
    }

    debugOnline({ id }) {
        this.$navigateTo('model/debug', { id }, true)
    }

    viewRow({ id }) {
        this.$openDialog(DetailDialog)({ serviceId: id })
    }

    delRow({ id }) {
        this.$confirm('模型删除后，将终止模型的线上服务，确认删除？', '提示').then(() => {
            delById(id).then(() => this.refreshCurrentPage())
        })
    }

    openNewModelDialog() {
        this.$openDialog(ModifyDialog)().then(() => this.doneSuccessOperation('服务创建中，请稍等'))
    }

    openUpdateModelDialog({ id }) {
        this.$openDialog(ModifyDialog)({
            serviceId: id,
            isUpdateModel: true, // 只更新模型
            isUpdateService: false
        }).then(() => this.doneSuccessOperation('模型更新中，请稍等'))
    }

    openUpdateServiceDialog({ id }) {
        this.$openDialog(ModifyDialog)({
            serviceId: id,
            isUpdateModel: false,
            isUpdateService: true // 只更新service
        }).then(() => this.doneSuccessOperation('资源更新中，请稍等'))
    }

    doneSuccessOperation(tooltip) {
        this.$message.success(tooltip)
        this.refresh()
    }

    getStatusText({ status, errorMsg }) {
        return status + (errorMsg ? `:${errorMsg}` : '')
    }

    getResourceText(row) {
        let { copyNumber } = row
        return `${copyNumber}副本 ${formatModelResourceTotal(row)}`
    }

    disabledOperation({ status }, type) {
        console.log(status, type, 1)
        return OperationDisabled[type][status]
    }
}
</script>

<style lang="scss" scoped></style>
