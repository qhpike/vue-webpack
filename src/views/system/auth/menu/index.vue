<template>
  <div class="container">
    <el-form ref="form">
      <el-row class="top-button">
        <button
          class="pan-btn tiffany-btn"
          type="primary"
          v-permission="'api:v1:menu:create'"
          @click="handleAdd"
        >
          新增
        </button>
      </el-row>
    </el-form>
    <div class="box-show">
      <el-table
        ref="menuTable"
        v-loading="isLoading"
        fit
        :data="menuall"
        row-key="id"
        size="mini"
        :height="tableHeight"
        :header-cell-style="headClass"
        :expand-row-keys="menuall.map((item) => item.id + '')"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @row-click="handleRowClick"
      >
        <el-table-column prop="title" label="名称">
          <template slot-scope="scope">
            <span style="margin-right: 16px">{{ scope.row.title }}</span>
            <el-tag
              v-if="scope.row.hidden && scope.row.type !== 2"
              type="danger"
              effect="dark"
              size="mini"
              >隐藏</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="图标" prop="icon" align="center">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template v-slot="{ row }">
            <el-tag
              size="small"
              effect="dark"
              :type="row.type === 1 ? 'primary' : 'warning'"
              >{{ row.type === 1 ? "菜单" : "权限" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="router" label="路由" align="center" />
        <el-table-column prop="viewPath" label="文件路径" align="center" />

        <el-table-column prop="perms" label="权限" align="center">
          <template v-slot="{ row }">
            <el-tag
              v-if="row.type === 2 && row.perms"
              effect="dark"
              type="warning"
              size="mini"
              class="tag-perm-item"
              >{{ row.perms }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="name" label="命名路由" align="center" />
        <el-table-column prop="redirect" label="重定向" align="center" />
        <el-table-column prop="keepalive" label="路由缓存" align="center">
          <template slot-scope="scope">
            <i
              v-if="scope.row.keepalive && scope.row.type === 1"
              class="el-icon-check"
            />
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="排序号" align="center" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              v-permission="'api:v1:menu:update'"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              v-permission="'api:v1:menu:delete'"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <menu-dialog
      :id.sync="id"
      :visible.sync="visible"
      :menu-tree="menuTree"
      @success="getList"
    />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { getTableHeight } from "@/utils/index";
import { formatRouterTree } from "@/utils/routerHook";
import MenuDialog from "./components/MenuDialog";
export default {
  components: {
    MenuDialog,
  },
  data() {
    return {
      id: undefined,
      visible: false,
      isLoading: false,
      menuTree: {
        data: [],
        props: {
          children: "children",
          label: "title",
        },
      },
      menuall: [],
      tableHeight: undefined,
    };
  },
  created() {},
  async mounted() {
    this.getList();
    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 20 - 40 - 20;
    });
  },
  methods: {
    headClass() {
      return "text-align: center;background:#ebeef4;";
    },
    async getList(handle) {
      this.isLoading = true;
      try {
        const { code, data } = await this.$service.menu.list();
        if (code !== 200) return;
        this.menuTree.data = this.menuall = formatRouterTree(data.roles);
      } catch (error) {
      } finally {
        this.isLoading = false;
      }
    },
    handleRowClick(row, index, e) {
      this.$refs.menuTable.toggleRowExpansion(row);
    },
    handleAdd() {
      this.dialogMode = 0;
      this.visible = true;
    },
    async handleDelete({ id }) {
      try {
        await this.$confirm("此操作将永久删除，是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        });
        const result = await this.$service.menu.delete(id);
        if (result.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "删除失败",
            type: "error",
          });
        }
      } catch (error) {
        this.$message.info(error);
      }
      this.getList();
    },
    handleEdit({ id }) {
      this.id = id;
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-button {
  margin-bottom: 20px;
  text-align: right;
  padding-right: 20px;
  /* padding-left: 15px; */
}
</style>
