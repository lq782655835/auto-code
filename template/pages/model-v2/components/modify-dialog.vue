{{##def.capitalizeName:{{=it.server.conflict+it.name.charAt(0).toUpperCase()+it.name.slice(1)}}#}}

{{##def.list:get{{#def.capitalizeName}}List#}}
{{##def.detail:get{{#def.capitalizeName}}DetailById#}}
{{##def.del:del{{#def.capitalizeName}}ById#}}
{{##def.create:create{{#def.capitalizeName}}#}}
{{##def.update:update{{#def.capitalizeName}}#}}
<template>
    <el-dialog
        :title="getTitleText"
        :visible.sync="visible"
        width="600px"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
    >
        <u-layout dir="v">
            <u-page-form
                v-model="form"
                :refObj.sync="formConfig.ref"
                :fieldList="formConfig.fieldList"
            />
            <u-layout alignment="center">
                <el-button type="primary" @click="submit">{{='{'+'{getSubmitBtnText}'+'}'}}</el-button>
                <el-button @click="close(false)">取消</el-button>
            </u-layout>
        </u-layout>
    </el-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import ModelCloseMixin from '@/components/mixins/model-close'
import { {{#def.detail}}, {{#def.create}}, {{#def.update}} } from '@/server'

@Component
export default class ModifyDialog extends Mixins(ModelCloseMixin) {
    @Prop(Number) id: number // 无值代表新增

    get isAddPage(): boolean {
        return typeof this.id === 'undefined'
    }
    get getTitleText(): string {
        return this.isAddPage ? '新建{{=it.cnName}}' : '修改{{=it.cnName}}'
    }
    get getSubmitBtnText(): string {
        return this.isAddPage ? '确认' : '确认修改'
    }

    form = {{=JSON.stringify(it.formConfig.model)}}
    get formConfig() {
        return {
            ref: null,
            fieldList: {{=JSON.stringify(it.formConfig.fieldList)}}
        }
    }

    async mounted() {
        if (!this.isAddPage) {
            const detail = await {{#def.detail}}(this.id) as any
            this.form = {...this.form, ...detail}
        }
    }

    /** 提交表单 */
    async submit() {
        let isPass = await (this.formConfig.ref as any).validate()
        if (!isPass) return

        if (this.isAddPage) {
            {{#def.create}}(this.form).then(data => this.close(true))
        } else {
            {{#def.update}}(this.form).then(data => this.close(true))
        }
    }
}
</script>
