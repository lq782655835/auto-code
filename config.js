module.exports = {
  name: "modelv2",
  cnName: "模型",
  server: {
    conflict: "",
    prefix: "/inference/v2/model"
  },
  filterConfig: {
    condition: {
      modelName: '',
      modelType: ''
    },
    query: [
        { type: 'input', label: '模型名称', value: 'modelName' },
        { type: 'select', label: '模型类型', value: 'modelType' },
        {
            type: 'button',
            label: '查询',
            event: 'search',
            icon: 'el-icon-search',
            disabled: 'this.loading'
        },
        {
            type: 'button',
            label: '创建模型',
            event: 'create',
            icon: 'el-icon-plus'
        }
    ]
  },
  tableConfig: {
    fieldList: [
        { label: 'ID', value: 'id' },
        { label: '模型名称', value: 'modelName' },
        { label: '模型类型', value: 'modelType' },
    ],
    handle: {
        fixed: 'right',
        label: '操作',
        width: '150',
        btList: [
            { label: '新增版本', event: 'open', icon: 'el-icon-plus' },
            { label: '删除', event: 'delete', btType: 'danger', icon: 'el-icon-delete' }
        ]
    }
  },
  formConfig: {
    model: {
      modelName: '',
      modelType: '',
      sourceType: '',
      fileName: '',
      sourceLink: '',
      runtimeArgs: '',
      metadata: ''
    },
    fieldList: [
        {
            label: '模型名称',
            value: 'modelName',
            type: 'input',
            disabled: '!this.isAddPage',
            required: true
        },
        {
            label: '模型类型',
            value: 'modelType',
            type: 'select',
            required: true,
            options: this.departmentList,
            disabled: !this.isAddPage
        },
    ]
  }
};
