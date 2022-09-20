<template>
  <el-dialog
    :title="mode===0 ? '新增':'编辑'"
    :visible="visible"
    center
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="handleDialogOpen"
    @close="handleDialogClosed"
  >
    <el-form ref="menuForm" :model="menuForm" :rules="getMenuTypeRulues" label-width="80px">
      <el-form-item label="菜单类型">
        <el-radio-group v-model="menuForm.type" @change="handleMenuTypeChange">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="节点名称" label-width="80px" prop="title">
        <el-input v-model.trim="menuForm.title" placeholder="请输入节点名称" />
      </el-form-item>
      <el-form-item label="上级节点" label-width="80px" prop="parent_id">
        <el-popover v-model="popdisplay" placement="bottom-start" width="500">
          <el-tree
            ref="pidtree"
            node-key="id"
            :expand-on-click-node="false"
            :data="menuTree.data"
            :props="menuTree.props"
            @node-click="handleMenuNodeClick"
          />
          <el-input
            slot="reference"
            v-model="parentNodeName"
            placeholder="请选择上级节点"
            readonly
          />
        </el-popover>
      </el-form-item>
      <!-- 分面板 -->
      <!-- 菜单面板 -->
      <div v-if="menuForm.type === 1" class="menu-pane">
        <el-form-item label="命名路由" label-width="80px" prop="name">
          <el-input v-model.trim="menuForm.name" placeholder="请输入路由名称" />
        </el-form-item>
        <el-form-item label="节点路由" label-width="80px" prop="router">
          <el-input v-model.trim="menuForm.router" placeholder="请输入节点路由" />
        </el-form-item>
        <el-form-item label="节点图标" label-width="80px" prop="icon">
          <el-select v-model="menuForm.icon" placeholder="请选择图标" style="width: 100%;" prop="icon">
            <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
              <span style="float: left; font-size: 16px; color: #444444;">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="menuForm.parent_id!==0" label="文件路径" label-width="80px">
          <el-select v-model="menuForm.view_path" placeholder="请选择文件路径" style="width: 100%;">
            <el-option v-for="(item,key) in viewFiles" :key="key" :label="key+item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="重定向" label-width="80px">
          <el-input v-model.trim="menuForm.redirect" placeholder="请输入重定向" />
        </el-form-item>
        <el-form-item label="是否显示" label-width="80px">
          <el-switch v-model="menuForm.hidden" :active-value="0" :inactive-value="1" />
        </el-form-item>
        <el-form-item label="开启缓存" label-width="80px">
          <el-switch v-model="menuForm.keepalive" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </div>
      <!-- 权限面板 -->
      <div v-if="menuForm.type === 2" class="perms-pane">
        <el-form-item label="权限" label-width="80px" prop="perms">
          <el-cascader
            v-model="menuForm.perms"
            separator=":"
            style="width: 50%;"
            :options="perms.options"
            :props="perms.props"
            clearable
          />
        </el-form-item>
      </div>
      <!-- 分面板结束 -->
      <el-form-item label="排序号" label-width="80px">
        <el-input-number
          v-model="menuForm.order_id"
          controls-position="right"
          :min="0"
          style="width: 100%;"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button @click="$emit('update', false)">取 消</el-button>
        <el-button type="primary" @click="handleSaveMenu">确 定</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import svgIcons from '@/utils/svg-icons'
import { asyncRoutesMap } from '@/router/index'
import { flatPerms, filterPerms } from '@/utils/permission'
export default {
    name: 'MenuDialog',
    model: {
        prop: 'visible',
        event: 'update'
    },
    props: {
        mode: {
            type: Number,
            default: 1,
            validator: function(value) {
                return value === 0 || value === 1
            }
        },
        menuTree: {
            type: Object,
            required: true
        },
        visible: {
            type: Boolean,
            required: true
        },
        menuId: {
            type: Number,
            default: -1
        }

    },
    data() {
        return {
            svgIcons,
            parentNodeName: '根目录',
            menuForm: {
                id: -1,
                parent_id: 0,
                perms: '',
                hidden: 0,
                icon: '',
                name: '',
                title: '',
                router: '',
                view_path: '',
                redirect: '',
                type: 1,
                order_id: 0,
                keepalive: 1
            },
            perms: {
                // 权限
                props: { multiple: true },
                options: []
            },
            menuFormRules: {
                menu: {
                    name: [{ required: true, message: '请输入路由命名', trigger: 'blur' }],
                    title: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
                    router: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
                    icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
                    parent_id: [{ required: true, message: '请选择上级节点', trigger: 'change' }]
                },
                perm: {
                    title: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
                    perms: [{ required: true, message: '请选择权限', trigger: 'change' }]
                }
            },
            popdisplay: true
        }
    },
    computed: {
        viewFiles: function() {
            return asyncRoutesMap
        },
        getMenuTypeRulues: function() {
            if (this.menuForm.type === 1) {
                return this.menuFormRules.menu
            } else {
                return this.menuFormRules.perm
            }
        }
    },
    watch: {
        'menuForm.type': function(newss, old) {
        },
        menuId: function(newid, oldid) {
        },
        'menuForm.parent_id': function(newpid, oldpid) {
        },
        deep: true
    },
    created() {
        this.initPerms()
    },
    mounted() {
      for (const key in asyncRoutesMap) {
        if (Object.hasOwnProperty.call(asyncRoutesMap, key)) {
          console.log(key,'key')
          
        }
      }
    },
    methods: {
        handleMenuNodeClick(data) {
            this.menuForm.parent_id = data.id
            this.parentNodeName = data.title
            this.popdisplay = false
        },
        handleDialogOpen() {
            this.$emit('update', true)
            this.getmenuinfo(this.menuId)
        },
        handleDialogClosed() {
            // 重置表单
            this.menuForm = {
                id: -1,
                parent_id: 0,
                perms: '',
                hidden: 0,
                icon: '',
                name: '',
                title: '',
                router: '',
                view_path: '',
                redirect: '',
                type: 1,
                order_id: 0,
                keepalive: 1
            }
            this.parentNodeName = '根目录'
            this.$emit('update', false)
            if (this.$refs.menuForm) {
                this.$refs.menuForm.clearValidate()
            }
        },
        handleMenuTypeChange() {
            if (this.$refs.menuForm) {
                this.$refs.menuForm.clearValidate()
            }
        },

        // 初始化权限数据
        initPerms() {
            const options = []
            flatPerms(this.$service).filter((e) => e.includes(':'))
                .map(e => e.split(':'))
                .forEach(arr => {
                    filterPerms(0, arr, options)
                })
            this.perms.options = options
        },
        splitPerms(perms) {
            const arr = perms.split(',')
            return arr.map(e => e.split(':'))
        },
        joinPerms(perms) {
            const str = perms.map(perm => perm.join(':')).join(',')
            return str
        },
        async getmenuinfo() {
            if (this.mode === 1 && this.menuId) {
                // const info = await getinfo(this.menuId)
                // api改为this.$service引入
                const info = await this.$service.menu.info(this.menuId)
                if (info.code === 200) {
                    // this.menuForm = Object.assign({}, info.data)
                    const { menu, parent } = info.data
                    if (menu.type === 2) {
                        const perms = this.splitPerms(menu.perms)
                        menu.perms = perms
                    }
                    this.menuForm = { ...menu }
                    if (parent) {
                        this.parentNodeName = parent.title
                    } else {
                        this.parentNodeName = '根目录'
                    }
                } else {
                    this.$message.error('数据获取失败')
                }
            }
        },
        async handleSaveMenu() {
            try {
                const check = await this.$refs.menuForm.validate()
                if (check) {
                    this.menuSave()
                }
            } catch (error) {
                // console.log(error, '检测错误结果')
                return
            }
        },
        async menuSave() {
            const postData = { ...this.menuForm }
            if (postData.type === 2) {
                postData.perms = this.joinPerms(postData.perms)
                console.log(postData)
            } else {
                delete postData.perms
            }
            try {
                if (this.mode === 0) {
                    console.log(postData)
                    postData.id = null
                    const result = await this.$service.menu.add({ ...postData })
                    this.$message({ message: result.message, type: 'success' })
                } else if (this.mode === 1) {
                    const result = await this.$service.menu.update({ ...postData })
                    this.$message({ message: result.message, type: 'success' })
                }
                this.$emit('update', false)
            } catch (error) {
                this.$message.error('操作失败')
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.select-icon {
  font-size: 16px;
}

</style>
