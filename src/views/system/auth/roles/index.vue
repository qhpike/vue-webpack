<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-tree
            :data="areaTree.data"
            :props="areaTree.defaultProps"
            node-key="id"
            :default-expanded-keys="[1]"
            :default-checked-keys="[1]"
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="grid-content">

          <el-button   size="small" type="primary" @click="handleAddRole">新增角色</el-button>

          <el-table
            :data="tableData"
            border
            fit
            highlight-current-row
            :header-cell-style="headClass"
            style="width: 100%;margin-top:30px;"
          >
            <el-table-column align="center" prop="name" label="角色名" width="140" />
            <el-table-column align="center" prop="label" label="描述" width="140" />
            <el-table-column align="center" prop="areaname" label="机构" width="140" />
            <el-table-column align="center" prop="create_time" :formatter="dateFormat" label="创建时间" width="200" />

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleEdit(scope)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-col>
    </el-row>
    <el-dialog :title="dialogType==='edit' ? '角色编辑':'新增角色' " :visible.sync="dialogVisible">
      <el-form ref="roleForm" :rules="rules" :model="role" label-width="80px" label-position="left">
        <el-form-item label="部门机构" prop="area_id">
          <el-cascader
            ref="areaTree"
            v-model="role.area_id"
            :disabled="dialogType!=='new'"
            :options="newArea.data"
            :props="newArea.defaultProps"
            clearable
            :show-all-levels="false"
            placeholder="请选择机构"
            @change="toggleDropDown"
          />
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model.trim="role.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model.trim="role.label" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="选择权限" prop="routes">
          <el-tree
            ref="menu"
            :data="roles"
            show-checkbox
            :props="roleTree.defaultProps"
            node-key="id"
            :check-strictly="checkStrictly"
            class="permission-tree"
            @check-change="handleCheckChange"
          />
        </el-form-item>
        <!-- <menuTable :rules="rules" /> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelHandler">取 消</el-button>
        <el-button type="primary" @click="confirmRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime, deepClone } from '@/utils/index'
import { mapGetters } from 'vuex'
// import menuTable from './menuTable.vue'
const defaultRole = {
    id: 0,
    area_id: null,
    name: '',
    label: '',
    remark: '',
    routes: []
}
export default {

    data() {
        return {
            areaTree: {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            },
            newArea: {
                data: [],
                defaultProps: {
                    value: 'id',
                    children: 'children',
                    label: 'name',
                    emitPath: false,
                    checkStrictly: true
                }
            },
            roleTree: {
                defaultProps: {
                    children: 'children',
                    label: 'title'
                }
            },
            tableData: [],
            dialogVisible: false,
            dialogType: 'new',
            formLabelWidth: '120px',
            checkStrictly: false,
            role: Object.assign({}, defaultRole),
            rules: {
                area_id: [{ required: true, message: '请选择部门机构', trigger: 'blur' }],
                name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                routes: [{ required: true, message: '请选择权限', trigger: 'change' }]
            }
        }
    },
    computed: {
        ...mapGetters(['roles', 'areaid'])
    }, // 此处roles为当前用户的routes
    mounted() {
        this.getareatree()
        // this.getarearoles(this.areaid)
    },
    methods: {
        handleNodeClick(data) { // 点击树
            this.getarearoles(data.id)
        },
        async getareatree() { // 获取角色树型数据
            const { data } = await this.$service.area.list()
            console.log(data, 'now')
            this.areaTree.data = data
            this.newArea.data = data
        },
        async getarearoles(id) { // 获取各区域的角色数据
            const arearoles = await this.$service.role.list(id)
            this.tableData = arearoles.data
        },
        // 时间格式化
        dateFormat(row, column) {
            const oldtime = row[column.property]
            return parseTime(new Date(oldtime))
        },
        handleAddRole() { // 新增用户
            this.role = Object.assign({}, defaultRole)
            if (this.$refs.menu) {
                this.$refs.menu.setCheckedKeys([])
            }
            this.dialogType = 'new'
            this.dialogVisible = true
        },
        async delRole(id, area_id) { // 删除角色
            const result = await this.$service.role.delete(id)
            if (result.code === 200) {
                this.$message({ message: '角色已删除', type: 'success' })
                this.getarearoles(area_id) // 更新角色列表
            } else {
                this.$message.error('删除失败')
            }
        },
        async handleDelete(scope) { // 调出删除角色确认弹框
            try {
                await this.$confirm('此操作将永久删除角色，是否确认继续', '请确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                const data = { id: scope.row.id }
                this.delRole(data, scope.row.area_id) // 调用删除角色
            } catch (error) {
                console.log(error)
            }
        },
        handleCheckChange() {
            const checkedKeys = this.$refs.menu.getCheckedKeys()
            const halfChackedKeys = this.$refs.menu.getHalfCheckedKeys()
            const checkedRoute = [...halfChackedKeys, ...checkedKeys]
            this.role.routes = checkedRoute
        },
        handleEdit(scope) { // 编辑角色
            console.log(this.roles, '0000000')
            const test = JSON.parse(JSON.stringify(this.roles))
            console.log(test, '%%%%%')

            function deepgo(pre) {
                if (pre.children) {
                    pre.children.forEach(item => {
                        if (!item.children && item.type === 2) {
                            if (pre.auth) {
                                pre.auth.push(item)
                            } else {
                                pre.auth = [item]
                            }
                        } else {
                            if (item.children) {
                                deepgo(item)
                            }
                        }
                    })
                }
                return pre
            }
            const myss = test.map(item => {
                return deepgo(item)
            })
            console.log(myss, '$$%%$$')
            this.dialogType = 'edit'
            this.checkStrictly = true
            this.dialogVisible = true// 防止显示菜单节点时候联动父节点
            this.role = deepClone(scope.row)
            console.log(this.role, '要修改的角色')
            const arr = this.role.routes.map(r => {
                return r.id
            })
            this.$nextTick(() => {
                this.$refs.menu.setCheckedKeys(arr, false)
                this.checkStrictly = false
            })
        },
        cancelHandler() {
            this.dialogVisible = false
            this.$refs.roleForm.clearValidate()
        },
        async confirmRole() {
            try {
                const check = await this.$refs.roleForm.validate()
                console.log(check, '检验结果')
                if (check) {
                    this.roleSave()
                }
            } catch (error) {
                return
            }
        },
        async roleSave() { // 弹出框，角色保存按钮,修改或者新增
            const isEdit = this.dialogType === 'edit'
            // const checkedKeys = this.$refs.menu.getCheckedKeys()
            // const halfChackedKeys = this.$refs.menu.getHalfCheckedKeys()
            // const checkedRoute = [...halfChackedKeys, ...checkedKeys]
            // this.role.routes = checkedRoute
            if (isEdit) {
                console.log(this.role, '编辑数据')
                // return
                const result = await this.$service.role.update(this.role)
                if (result.data.success) {
                    this.$message({
                        message: '角色修改成功',
                        type: 'success'

                    })
                } else {
                    this.$message.error('角色修改失败')
                    return
                }
                this.dialogVisible = false
                this.getarearoles(this.role.area_id)
            } else {
                const { data } = await this.$service.role.add(this.role)
                if (data.success) {
                    this.$message({
                        message: '角色创建成功',
                        type: 'success'

                    })
                } else {
                    this.$message.error('角色创建失败')
                    return
                }
                this.dialogVisible = false
                this.getarearoles(this.role.area_id)
            }
        },
        toggleDropDown() {
            this.$refs.areaTree.toggleDropDownVisible()
        },
        headClass() {
            return 'text-align: center;background:#eef1f6;'
        }

    }
}
</script>
<style lang="scss" scoped>
      .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .permission-tree {
    margin-bottom: 30px;
  }

</style>
