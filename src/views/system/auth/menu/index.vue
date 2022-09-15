<template>
  <div class="menu-container">
    <div class="menu-header">
      <el-row class="top-button">
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
        <el-button  type="primary" size="mini" @click="menuAdd">新增</el-button>
      </el-row>
    </div>
    <div class="menu-content">
      <el-table
        ref="menuTable"
        v-loading="isLoading"
        fit
        size="small"
        style="width:100%"
        :data="menuall"
        row-key="id"
        border
        :header-cell-style="headClass"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @row-click="handleRowClick"
      >
        <el-table-column
          prop="title"
          label="名称"
          sortable
          width="180"
        >
          <template slot-scope="scope">
            <span style="margin-right: 16px">{{ scope.row.title }}</span>
            <el-tag
              v-if="scope.row.hidden && scope.row.type !== 2"
              type="danger"
              effect="dark"
              size="mini"
            >隐藏</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="图标" prop="icon" align="center" width="120">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag size="small" effect="dark" :type="getMenuType(scope.row.type)">{{
              getMenuLabel(scope.row.type)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="router"
          label="节点路由"
          align="center"
          width="120"
        />
        <el-table-column
          prop="view_path"
          label="文件路径"
          align="center"
          width="120"
        />

        <el-table-column
          prop="perms"
          label="权限"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="i in splitPerms(scope.row.perms)"
              :key="i"
              effect="dark"
              size="mini"
              class="tag-perm-item"
            >{{ i }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="命名路由"
          align="center"
          width="120"
        />
        <el-table-column
          prop="redirect"
          label="重定向"
          align="center"
          width="120"
        />
        <el-table-column
          prop="keepalive"
          label="路由缓存"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <i
              v-if="scope.row.keepalive && scope.row.type === 1"
              class="el-icon-check"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="order_id"
          label="排序号"
          align="center"
          width="80"
        />
        <el-table-column
         
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button  type="text" size="mini" @click="menuEdit(scope.row)">编辑</el-button>
            <el-button  type="text" size="mini" @click="menuDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <menu-dialog
      id="ss"
      v-model="visible"
      :mode="dialogMode"
      :menu-tree="menuTree"
      :menu-id="menuId"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { loadJs } from '@/utils/index'
import { formatRouterTree } from '@/utils/routerHook'
import MenuDialog from './components/MenuDialog'
import { debounce } from 'lodash'
export default {
    components: {
        MenuDialog
    },
    data() {
        return {
            dialogMode: 0,
            visible: false,
            isLoading: false,
            menuTree: {
                data: [],
                props: {
                    children: 'children',
                    label: 'title'
                }
            },
            menuId: -1,
            menuall: []
        }
    },
    computed: {
    },
    watch: {
        visible(mynew, myold) {
            console.log('新', mynew, '旧', myold)
        }
    },
    beforeCreate() {
    },
    created() {
        this.initMenuAll()
    },
    beforeMount() {
    },
    async mounted() {
      const aes = await loadJs('./sdk.js')
      console.log(aes,'aesxx')
    },
    methods: {
        headClass() {
            return 'text-align: center;background:#ebeef4;'
        },
        handleRefresh: debounce(function() {
            this.isLoading = true
            this.initMenuAll('handle')
        }, 2000, {
            leading: true,
            trailing: false
        }),
        Refresh() {
            debounce(this.Refresh, 500, {
                leading: true,
                trailing: false
            })
        },
        async initMenuAll(handle) {
            const { data } = await this.$service.menu.list()
            this.menuall = formatRouterTree(data)
            handle && this.$message({ message: '刷新成功', type: 'success', duration: 1000 })
            this.isLoading = false
        },
        getMenuLabel(type) {
            switch (type) {
                case 1:
                    return '菜单'
                case 2:
                    return '权限'
            }
        },
        getMenuType(type) {
            switch (type) {
                case 1:
                    return 'primary'
                case 2:
                    return 'warning'
            }
        },
        splitPerms(perms) {
            if (perms) {
                const permsArray = perms.split(',')
                if (permsArray && permsArray.length > 0) {
                    return permsArray
                }
            }
            return []
        },
        handleRowClick(row, index, e) {
            this.$refs.menuTable.toggleRowExpansion(row)
        },
        menuAdd() {
            this.menuTree.data = this.menuall
            this.dialogMode = 0
            this.visible = true
        },
        async menuDelete(item) {
            try {
                await this.$confirm('此操作将永久删除，是否继续', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                })
                const result = await this.$service.menu.delete(item.id)
                if (result.code === 200) {
                    this.$message({
                        message: result.message,
                        type: 'success'
                    })
                } else {
                    this.$message({
                        message: result.message,
                        type: 'error'
                    })
                }
                console.log(result.message)
            } catch (error) {
                console.log(error)
            }
        },
        menuEdit(item) {
            this.menuId = item.id
            this.menuTree.data = this.menuall
            this.dialogMode = 1
            this.visible = true
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
  padding: 15px;
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
}
</style>
