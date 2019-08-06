module.exports = {
  name: "project",
  cnName: "项目",
  server: {
    conflict: "Inference",
    prefix: "/auth/inference"
  },
  query: [
    {
      prop: "searchType",
      ui: "el-select",
      placeholder: "请选择类型",
      defaultValue: "'1'",
      data: [
        {
          label: "项目名称",
          value: "1"
        },
        {
          label: "归属部门",
          value: "2"
        },
        {
          label: "项目管理员",
          value: "3"
        }
      ]
    },
    {
      prop: "search",
      ui: "el-input",
      placeholder: "请输入查询关键字",
      defaultValue: "''"
    }
  ],
  operation: [
    {
      label: "新建项目",
      color: "primary",
      icon: "el-icon-plus",
      event: "createRow"
    }
  ],
  list: {
    tableConfig: [
      {
        prop: "name",
        label: "项目名称"
      },
      {
        prop: "manager",
        label: "项目管理员"
      },
      {
        prop: "department.departName",
        label: "归属部门"
      },
      {
        prop: "members",
        label: "项目成员"
      },
      {
        prop: "gmtCreate",
        label: "创建时间",
        filter: "formatTime"
      },
      {
        prop: "gmtUpdate",
        label: "更新时间",
        filter: "formatTime"
      }
    ],
    operation: [
      {
        label: "修改",
        color: "primary",
        event: "editRow"
      },
      {
        label: "删除",
        color: "danger",
        event: "delRow"
      }
    ]
  },
  properties: [
    {
      prop: "name",
      label: "项目名称",
      placeholder: "请输入项目名称",
      defaultValue: "''",
      ui: "el-input",
      required: "请输入项目名称"
    },
    {
      prop: "departmentId",
      label: "项目部门",
      placeholder: "请选择项目部门",
      defaultValue: "''",
      ui: "el-select",
      data: [
        {
          label: "考拉",
          value: "1"
        }
      ],
      required: "请选择项目部门"
    }
  ]
};
