module.exports = {
    "name": "project",
    "cnName": '项目',
    "server": {
        conflict: 'Inference',
        prefix: '/auth/inference'
    },
    "query": [{
        prop: "type",
        ui: 'el-select',
        placeholder: '请选择类型',
        defaultValue: "'项目名称'",
        data: [{
            label: '项目名称',
            value: '项目名称'
        },{
            label: '归属部门',
            value: '归属部门'
        },{
            label: '项目管理员',
            value: '项目管理员'
        }]
    },
    {
        prop: "searchContent",
        ui: 'el-input',
        placeholder: '请输入查询关键字',
        defaultValue: "''"
    }],
    operation: [
        {
            "label": "新增项目",
            "color": "primary",
            "event": 'createRow',
        }
    ],
    "properties": [{
        "prop": "name",
        "label": "项目名称",
        placeholder: '请输入项目名称',
        defaultValue: "''",
        "ui": "el-input",
        required: '请输入项目名称'
    },{
        "prop": "departmentId",
        "label": "项目部门",
        placeholder: '请选择项目部门',
        defaultValue: "''",
        "ui": "el-select",
        data: [{
            label: '考拉',
            value: '1'
        }],
    }],
    "list": {
        "tableConfig": [{
            "prop": "name",
            "label": "项目名称",
        } , {
            "prop": "manager",
            "label": "项目管理员"
        }, {
            "prop": "departmentId",
            "label": "归属部门"
        },
        {
            "prop": "members",
            "label": "项目成员"
        },
        {
            "prop": "gmtCreate",
            "label": "创建时间",
            "filter": "formatTime"
        },
        {
            "prop": "gmtUpdate",
            "label": "更新时间",
            "filter": "formatTime"
        }
        ],
        "operation": [
            {
                "label": "修改",
                "color": "primary",
                "event": 'editRow',
            },
            {
                "label": "删除",
                "color": "danger",
                "event": 'delRow',
            }
        ]
    }
}