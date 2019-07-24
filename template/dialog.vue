<template>
    <el-dialog
        :title="getTitleText"
        :visible.sync="visible"
        top="10vh"
        width="600px"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <u-layout dir="v" class="service-wrapper">
            <u-layout v-if="isAddServiceAndModel || isUpdateService" dir="v">
                <p class="sub-title">服务配置</p>
                <el-form
                    :model="formService"
                    :rules="rulesService"
                    ref="formService"
                    label-position="right"
                    label-width="100px"
                >
                    <el-form-item label="服务框架">
                        <el-select
                            :disabled="isUpdateServiceOrModel"
                            v-model="formService.serviceFramework"
                            placeholder="请选择框架"
                        >
                            <el-option
                                label="TensorFlow Serving"
                                value="TensorFlow Serving"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务名称" prop="serviceName">
                        <el-input
                            :disabled="isUpdateServiceOrModel"
                            v-model.trim="formService.serviceName"
                            placeholder="支持格式：小写字母、数字以及-,首位必须是字母"
                        />
                    </el-form-item>
                    <el-form-item label="资源类型">
                        <el-select
                            :disabled="isUpdateServiceOrModel"
                            v-model="formService.resourceType"
                            @change="changedResourceType"
                            placeholder="请选择资源类型"
                        >
                            <el-option label="CPU" value="CPU"></el-option>
                            <el-option label="GPU" value="GPU"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="isCPU" label="资源数">
                        <el-select
                            v-model="formService.copyNumber"
                            placeholder="请选择副本数"
                            size="small"
                        >
                            <el-option v-for="num in 10" :key="num" :label="num" :value="num" />
                        </el-select>
                        x
                        <el-select
                            v-model="formService.singleCopyResource"
                            placeholder="单副本资源"
                            size="small"
                        >
                            <el-option
                                v-for="{ label, value } in cpuUnitList"
                                :key="label"
                                :label="label"
                                :value="value"
                            />
                        </el-select>
                        = {{ getResouceText }} <span class="tip number">副本数</span>
                        <span class="tip resource">单副本资源</span>
                    </el-form-item>
                    <el-form-item v-else label="资源数">
                        <el-select
                            v-model="formService.copyNumber"
                            placeholder="请选择副本数"
                            size="small"
                        >
                            <el-option v-for="num in 8" :key="num" :label="num" :value="num" />
                        </el-select>
                        x
                        <el-select
                            v-model="formService.singleCopyResource"
                            placeholder="单副本资源"
                            size="small"
                        >
                            <el-option label="1卡8核32G" value="1-8-32"></el-option>
                        </el-select>
                        = {{ getResouceText }} <span class="tip number">副本数</span>
                        <span class="tip resource">单副本资源</span>
                    </el-form-item>
                </el-form>
            </u-layout>
            <u-layout v-if="isAddServiceAndModel || isUpdateModel" dir="v" class="model-wrapper">
                <p class="sub-title">模型配置</p>
                <el-form
                    :model="formModel"
                    ref="formModel"
                    class="model-form"
                    label-position="right"
                    label-width="100px"
                >
                    <div
                        v-for="(model, index) in formModel.modelList"
                        :key="index"
                        class="model-item"
                        v-loading="model.isLoading"
                    >
                        模型{{ index + 1 }}
                        <el-link
                            type="danger"
                            icon="el-icon-minus"
                            :underline="false"
                            @click="deleteModelItem(index, model)"
                            v-show="formModel.modelList.length > 1"
                            class="model-delete"
                            >删除</el-link
                        >
                        <el-form-item
                            label="模型文件"
                            :prop="'modelList.' + index + '.modelNosUrlCompression'"
                            :rules="rulesModel.modelNosUrlCompression"
                        >
                            {{ model.fileName }}
                            <el-link
                                type="primary"
                                @click="clickUpload(index)"
                                :underline="false"
                                icon="el-icon-plus"
                                >{{
                                    model.modelNosUrlCompression ? '重新上传' : '点击上传'
                                }}</el-link
                            >
                            <input
                                type="file"
                                :ref="'refUpload' + index"
                                hidden
                                @change="fileChange($event, model)"
                                accept=".zip,.rar,.tar,.gz"
                            />
                        </el-form-item>
                        <el-form-item
                            label="模型名称"
                            :prop="'modelList.' + index + '.modelName'"
                            :rules="rulesModel.modelName"
                        >
                            <el-input
                                v-model.trim="model.modelName"
                                placeholder="支持格式：小写字母、数字以及&quot;_&quot;,首位必须是字母"
                                :disabled="disabledEditModelName(model)"
                            />
                        </el-form-item>
                    </div>
                    <el-link
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        :underline="false"
                        @click="addModelItem"
                        >增加模型</el-link
                    >
                </el-form>
            </u-layout>
            <u-layout alignment="center">
                <el-button type="primary" @click="submit">{{ getSubmitBtnText }}</el-button>
                <el-button @click="close(false)">取消</el-button>
            </u-layout>
        </u-layout>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import ModelCloseMixin from '@/mixins/model-close'
import NOS_SDK from '@/utils/nos-js-sdk'
import {
    checkServiveName,
    getNosToken,
    createServiceAndModel,
    getModelDetailById,
    updateModel,
    getDetailById,
    updateService
} from '@/server'
import { MODEL_RESOURCE_TYPE_MAP } from '@/utils/config'
import { formatModelResourceTotal } from '@/pages/model/list.vue'

const rowModel = {
    modelName: '',
    modelNosUrlCompression: '',
    fileName: '',
    isLoading: false
}

@Component
export default class ModifyDialog extends Mixins(ModelCloseMixin) {
    @Prop(Number) serviceId: number // 无值代表新增
    @Prop(Boolean) isUpdateModel: boolean // 代表修改model
    @Prop(Boolean) isUpdateService: boolean // 代表修改service

    get isAddServiceAndModel(): boolean {
        return typeof this.serviceId === 'undefined'
    }
    get isUpdateServiceOrModel(): boolean {
        return !this.isAddServiceAndModel
    }
    get getTitleText(): string {
        return this.isUpdateModel
            ? '更新模型'
            : this.isUpdateService
            ? '配置线上资源'
            : '配置线上资源'
    }
    get getSubmitBtnText(): string {
        return this.isUpdateModel ? '更新模型' : this.isUpdateService ? '更新配置' : '部署上线'
    }
    get isCPU(): boolean {
        return this.formService.resourceType === MODEL_RESOURCE_TYPE_MAP.CPU
    }
    get getResouceText(): string {
        return formatModelResourceTotal(this.formService)
    }

    formService = {
        serviceFramework: 'TensorFlow Serving',
        serviceName: '',
        resourceType: MODEL_RESOURCE_TYPE_MAP.CPU,
        copyNumber: '',
        singleCopyResource: ''
    }

    formModel = {
        modelList: [{ ...rowModel }]
    }

    rulesService = {
        serviceName: [
            { required: true, message: '请输入服务名称', trigger: 'blur' },
            {
                required: true,
                pattern: /^[a-z]([a-z0-9-]*[a-z0-9-])?$/g,
                message: '请输入有效服务名',
                trigger: 'blur'
            },
            {
                validator: async (rule, value, callback) => {
                    let { repeat } = (await checkServiveName(value)) as any
                    if (repeat) {
                        callback(new Error('已有相同服务名'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ]
    }

    rulesModel = {
        modelNosUrlCompression: [
            {
                required: true,
                message: '模型不能为空',
                trigger: 'blur'
            }
        ],
        modelName: [
            {
                required: true,
                message: '模型名称不能为空',
                trigger: 'blur'
            },
            {
                required: true,
                pattern: /^[a-z][0-9a-z_]+$/g,
                message: '请输入有效模型名',
                trigger: 'blur'
            },
            {
                validator: async (rule, value, callback) => {
                    let repeatModel = this.formModel.modelList.filter(
                        ({ modelName }) => value === modelName
                    )
                    if (repeatModel.length > 1) {
                        callback(new Error('模型名称不能重复'))
                    } else {
                        callback()
                    }
                },
                trigger: 'blur'
            }
        ]
    }

    cpuUnitList = Array(10)
        .fill('')
        .map((str, index) => {
            let multiple = index + 1
            return {
                label: `${multiple}核${multiple * 4}G`,
                value: `${multiple}-${multiple * 4}`
            }
        })

    async mounted() {
        if (this.isAddServiceAndModel) {
            // 默认选择CPU以及关联的资源数
            this.changedResourceType(MODEL_RESOURCE_TYPE_MAP.CPU)
            console.log('new add')
        } else if (this.isUpdateModel) {
            let modelList: any = await getModelDetailById(this.serviceId)
            this.formModel.modelList = modelList
        } else if (this.isUpdateService) {
            let serviceDetail: any = await getDetailById(this.serviceId)
            this.formService = serviceDetail
        }
    }

    changedResourceType(type) {
        this.formService.copyNumber = '1'
        this.formService.singleCopyResource =
            type === MODEL_RESOURCE_TYPE_MAP.GPU ? '1-8-32' : '1-4'
    }

    /*** 模型配置事件 */
    addModelItem() {
        this.formModel.modelList.push({ ...rowModel })
    }

    deleteModelItem(index, { modelNosUrlCompression }) {
        let removeModelItem = () => this.formModel.modelList.splice(index, 1)
        if (modelNosUrlCompression) {
            this.$confirm('确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => removeModelItem())
        } else {
            removeModelItem()
        }
    }

    disabledEditModelName({ id }) {
        if (!this.isUpdateModel) return false
        return id !== undefined
    }

    clickUpload(index) {
        let targetFileInput = this.$refs['refUpload' + index]
        if (targetFileInput && targetFileInput[0]) {
            targetFileInput[0].click()
        }
    }

    fileChange(e, model) {
        let file = e.target.files[0]
        let { name } = file
        e.target.value = null // reset file input

        let checkPassFileSuffix = /\.(zip|rar|tar|tar\.gz)$/.test(name)
        if (!checkPassFileSuffix) {
            this.$message.error('文件格式错误,模型只支持.zip,.rar,.tar,.tar.gz文件格式')
            return
        }

        let suffix = ''
        if (name.endsWith('.tar.gz')) {
            // 双后缀.tar.gz单独处理
            suffix = '.tar.gz'
        } else {
            suffix = '.' + name.split('.').pop()
        }
        getNosToken({ suffix }).then((data: any) => {
            let { bucket: bucketName, objectname: objectName, token } = data
            let uploader = new NOS_SDK({})
            uploader.addFile(file, () => {
                console.log(data, 123)
                // 不能使用model.isLoading = true方式
                // 更新状态时，没有model无isLoading属性，无法监听
                this.$set(model, 'isLoading', true)
                uploader.upload({ token, bucketName, objectName }, () => {
                    console.log('file success')
                    model.fileName = name
                    model.modelNosUrlCompression = objectName
                    this.$set(model, 'isLoading', false)
                })
            })
        })
    }

    /** 提交表单 */
    submit() {
        if (this.isUpdateModel) {
            this.submitUpdateModel()
        } else if (this.isUpdateService) {
            this.submitUpdateService()
        } else if (this.isAddServiceAndModel) {
            this.submitAddServiceAndModel()
        }
    }

    async submitUpdateModel() {
        let isPass = await this.formSubmitPromise('formModel')
        if (isPass) {
            this.$confirm('即将更新模型，新模型上线后老模型将不再继续服务', '提示', {
                confirmButtonText: '确定更新',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateModel({
                    id: this.serviceId,
                    model: this.formModel.modelList
                }).then(() => this.close(true))
            })
        }
    }

    async submitUpdateService() {
        let { serviceId, formService } = this
        updateService({
            id: serviceId,
            ...formService
        }).then(() => this.close(true))
    }

    async submitAddServiceAndModel() {
        let validList = await Promise.all([
            this.formSubmitPromise('formService'),
            this.formSubmitPromise('formModel')
        ])
        console.log(validList, 123)
        // 校验不通过
        if (!validList.every(Boolean)) return

        // add
        createServiceAndModel({
            ...this.formService,
            model: this.formModel.modelList
        }).then(data => this.close(true))
    }

    formSubmitPromise(formRef) {
        return (this.$refs[formRef] as any).validate()
    }
}
</script>

<style lang="scss" scoped>
$gray: #dcdfe6;

.sub-title {
    margin: 10px 0;
    padding: 5px 10px;
    margin-right: 0px;
}

.service-wrapper {
    .el-select--small {
        width: 120px;
    }

    .el-form-item {
        position: relative;
        .tip {
            position: absolute;
            top: -26px;
            font-size: 12px;
            color: $tip-color-m;

            &.number {
                left: 2px;
            }

            &.resource {
                left: 138px;
            }
        }
    }
}

.model-wrapper {
    .model-form {
        height: 260px;
        overflow-y: auto;

        .model-item {
            border: 1px solid $gray;
            border-radius: 5px;
            padding: 10px 20px;
            margin-bottom: 10px;
            position: relative;

            .model-delete {
                position: absolute;
                right: 20px;
                top: 15px;
            }
        }
    }
}
</style>
