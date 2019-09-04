module.exports = {
  name: "jupyter",
  cnName: "实例",
  server: {
    conflict: "",
    prefix: "/jupyter/instance"
  },
  filterConfig: {
    condition: {
      search: ''
    },
    query: [
        { type: 'input', label: '实例名称或实例ID', value: 'search' },
        {
            type: 'button',
            label: '查询',
            event: 'search',
            icon: 'el-icon-search',
            disabled: this.loading
        },
        {
            type: 'button',
            label: '创建实例',
            event: 'create',
            icon: 'el-icon-plus'
        }
    ]
  },
  tableConfig: {
    fieldList: [
        { label: 'ID', value: 'id' },
        { label: '名称', value: 'instanceName' },
        { label: '实例状态', value: 'status' },
        { label: '资源类型', value: 'members' },
        { label: '运行时间', value: 'duration', type: 'filter', fn: 'timer' },
        { label: '更新时间', value: 'updateTime', type: 'filter', fn: 'formatTime' }
    ],
    handle: {
        fixed: 'right',
        label: '操作',
        width: '150',
        btList: [
            { label: '打开', event: 'open', icon: 'el-icon-edit' },
            { label: '启动', event: 'open', icon: 'el-icon-edit' },
            { label: '停止', event: 'stop', icon: 'el-icon-edit' },
            { label: '删除', event: 'delete', btType: 'danger', icon: 'el-icon-delete' }
        ]
    }
  },
  formConfig: {
    model: {
        name: '',
        departmentId: '',
        managerList: []
    },
    fieldList: [
        {
            label: '项目名称',
            value: 'name',
            type: 'input',
            disabled: !this.isAddPage,
            placeholder: '支持格式：小写字母、数字以及-',
            required: true,
            pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/g
        },
        {
            label: '项目部门',
            value: 'departmentId',
            type: 'select',
            required: true,
            options: this.departmentList,
            disabled: !this.isAddPage
        },
        { label: '管理员', value: 'managerList', type: 'slot' },
    ]
  }
};
