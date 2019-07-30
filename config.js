module.exports = {
    "name": "project",
    "server": {
        conflict: 'Inference',
        prefix: '/auth/inference'
    },
    "query": {
        type: {
            ui: 'el-input',
            placeholder: '请输入查询关键字'
        }
    },
    "properties": [{
        "prop": "name",
        "label": "姓名",
        "ui": "el-input",
        "vilidator": {
            "required": {
                "error": "请输入姓名"
            },
            "minLength": {
                "limit": 5,
                "error": "至少5个字符"
            }
        }
    }, {}],
    "list": {
        "tableConfig": [{
            "prop": "name",
            "label": "项目名称"
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
                "label": "新增",
                "color": "primary",
                "event": 'create',
            },
            {
                "label": "修改",
                "color": "primary",
                "event": 'edit',
            },
            {
                "label": "删除",
                "color": "danger",
                "event": 'del',
            }
        ]
    }
}