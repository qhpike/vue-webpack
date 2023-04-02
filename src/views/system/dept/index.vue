<template>
  <div class="container">
    <el-form ref="form" style="text-align: right">
      <el-button @click="handleCreate" type="primary" plain>新增</el-button>
    </el-form>
    <div class="box-show">
      <el-table
        ref="menuTable"
        v-loading="loading"
        fit
        :data="deptList"
        row-key="id"
        size="mini"
        :height="tableHeight"
        align="center"
        :header-cell-style="headClass"
        :expand-row-keys="deptList.map((item) => item.id + '')"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @row-click="handleRowClick"
      >
        <el-table-column label="id" prop="id" align="left" />
        <el-table-column prop="name" align="left" label="部门">
        </el-table-column>

        <el-table-column label="父级id" prop="parentId" align="center" />
        <el-table-column
          label="次序"
          prop="ancestors"
          align="center"
        ></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template v-slot="{ row }">
            {{ row.createTime | onlyDate }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
          <template v-slot="{ row }">
            {{ row.updateTime | onlyDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <template v-if="row.id !== areaId && row.parentId !== 0">
              <!-- 顶级部门不可修改，删除 -->
              <el-button type="text" @click="handleEdit(row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <dept-dialog
      :id.sync="deptId"
      :visible.sync="visible"
      :deptList="deptList"
      @success="getList"
    />
  </div>
</template>

<script>
import { getTableHeight, formatToAreaTree } from "@/utils/index";
import { mapGetters } from "vuex";
import DeptDialog from "./DeptDialog.vue";
export default {
  components: {
    DeptDialog,
  },
  data() {
    return {
      deptId: undefined,
      visible: false,
      deptList: [],
      loading: false,
      tableHeight: undefined,
      expendKeyList: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 20 - 40 - 20;
    });
    this.getList();
  },
  computed: {
    ...mapGetters(["areaId", "isRoot"]),
  },
  methods: {
    async getList() {
      this.loading = true;
      const { code, data } = await this.$service.area.list();
      if (code !== 200) return;
      if (this.isRoot) {
        this.deptList = formatToAreaTree(data);
      } else {
        this.deptList = formatToAreaTree(data, this.areaId, "self");
      }

      const expend = this.deptList.map((item) => item.id);
      this.loading = false;
    },
    handleRowClick(row, index, e) {
      this.$refs.menuTable.toggleRowExpansion(row);
    },
    headClass() {
      return "text-align: center;background:#ebeef4;";
    },
    handleCreate() {
      this.visible = true;
    },
    handleEdit({ id }) {
      this.deptId = id;
      this.visible = true;
    },
    async handleDelete({ id }) {
      await this.$confirm("此操作将永久删除，是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      });
      await this.$service.area.delete(id);
      this.getList();
      this.$message.success("删除成功");
    },
  },
};
</script>

<style lang="scss" scoped></style>
