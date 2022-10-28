<template>
  <div class="menu-container">
    <div class="menu-header">
      <div class="top-button">
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
        <el-button  type="primary" size="mini" @click="areaAdd">新增</el-button>
        <span>{{ ss }}</span>
      </div>

    </div>
    <div class="menu-content">
      <el-table
        v-loading="isLoading"
        highlight-current-row
        :data="areaData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        :expand-row-keys="expendDefault"
        size="medium"
        border
        :header-cell-style="headClass"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column
          prop="id"
          label="机构编号"
          width="180"
        />
        <el-table-column
          label="机构名称"
          align="center"
        >
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >
                取消
              </el-button>
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.create_time  }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
        >
          <template slot-scope="{ row }">
            <span>{{ row.update_time  }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button v-if="row.edit" size="small" type="success" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">确定</el-button>
            <el-button v-else  size="small" type="primary" icon="el-icon-edit" @click="row.edit=!row.edit">编辑</el-button>
            <el-button  size="small" type="danger" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="添加机构" :visible.sync="dialogFormVisible" @closed="dialogClose">
      <el-form ref="areaForm" :rules="areaRoles" :model="areaForm" label-width="80px">
        <el-form-item label="上级机构" prop="parentId">
          <el-cascader
            ref="areaTree"
            v-model="areaForm.parentId"
            :options="areaTree.data"
            :props="areaTree.defaultProps"
            clearable
            :show-all-levels="false"
            placeholder="请选择上级机构"
            @change="toggleVisible"
          />
        </el-form-item>
        <el-form-item label="机构名称" prop="name">
          <el-input v-model.trim="areaForm.name" placeholder="请输入机构名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('areaForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { toarea } from '@/utils/permission'
import { debounce } from 'lodash'
export default {
    data() {
        return {
            areaData: [],
            expendDefault: ['1'],
            isLoading: false,
            dialogFormVisible: false,
            areaForm: {
                parentId: null,
                name: null
            },
            ss: '',
            areaTree: {
                data: [],
                defaultProps: {
                    value: 'id',
                    children: 'children',
                    label: 'name',
                    emitPath: false,
                    checkStrictly: true
                }
            },
            areaRoles: {
                parentId: [{ required: true, message: '请选择上级机构', trigger: 'change' }],
                name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }]
            }
        }
    },
    beforeCreate() {
    },
    created() {
        this.initArea()
    },
    mounted() {
    },
    methods: {
        headClass() {
            return 'text-align: center;background:#ebeef4;'
        },
        async initArea() {
            const { data } = await this.$service.area.list()
            function addinfo(area) {
                area.map(item => {
                    item.originalTitle = item.name
                    item.edit = false
                    if (item.children) {
                        addinfo(item.children)
                    }
                })
            }
            addinfo(data)
            this.areaData = data
            this.areaTree.data = data
        },
        areaAdd() {
            console.log('添加')
            this.dialogFormVisible = true
        },
        async areaUpdate(data) {
            const result = await this.$service.area.update({ data })
            if (result.code === 200) {
                this.$message({ message: '机构修改成功', type: 'success' })
            } else {
                this.$message.error('操作失败')
            }
        },
        async areaDelete(id) {
            try {
                const result = await this.$service.area.delete(id)
                if (result.code === 200) {
                    this.$message.success('机构删除成功')
                } else {
                    this.$message.error('机构删除失败')
                }
            } catch (error) {
                console.log(error)
            }
        },
        confirmEdit(row) {
            row.originalTitle = row.name
            row.edit = false
            const newrow = { ...row }
            delete newrow.originalTitle
            delete newrow.edit
            delete newrow.children
            this.areaUpdate(newrow)
        },
        cancelEdit(row) {
            row.name = row.originalTitle
            row.edit = false
        },
        async  handleDelete(row) {
            try {
                await this.$confirm('此操作将永久删除，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                if (row.children) {
                    this.$message.error('有子机构，不可删除')
                } else {
                    this.areaDelete(row.id)
                }
            } catch (error) {
                console.log(error)
            }
        },
        handleRefresh: debounce(function() {
            this.isLoading = true
            this.initArea()
            this.isLoading = false
            this.$message({ message: '刷新成功', type: 'success' })
        },
        2000, {
            leading: true,
            trailing: false
        }
        ),
        toggleVisible() {
            this.$refs.areaTree.toggleDropDownVisible()
        },
        async submitForm(ref) {
            try {
                await this.$refs[ref].validate()
                const result = await this.$service.area.add(this.areaForm)
                console.log(result)
                this.$message.success('机构创建成功')
                this.areaForm = { parentId: null, name: null }
                this.$refs.areaForm.clearValidate()
                this.dialogFormVisible = false
            } catch (error) {
                console.log(error)
                this.$message.error('创建机构失败')
            }
        },
        dialogClose() {
            this.areaForm = { parentId: null, name: null }
            this.$refs.areaForm.clearValidate()
        }

    }
}
</script>

<style lang="scss" scoped>
.top-button{
margin-bottom: 20px;
/* padding-left: 15px; */
}
.menu-container {
  padding: 30px;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .menu-header {
    margin-bottom: 15px;
  }

  .menu-content {
    flex-grow: 1;
    overflow-y: auto;

    .tag-perm-item {
      margin-right: 4px;
    }
  }
  .edit-input {
  padding-right: 90px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
}
</style>
