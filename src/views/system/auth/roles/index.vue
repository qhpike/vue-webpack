<template>
  <div class="container">
    <el-form :model="query" label-width="80px" inline size="small" ref="form">
      <el-form-item label="部门:">
        <el-cascader
          v-model="query.areaId"
          placeholder="请选择部门"
          :options="deptList"
          ref="areaTree"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'id',
            emitPath: false,
            multiple: false,
          }"
          :show-all-levels="false"
          @change="areaChange"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="handleAdd">新增角色</el-button>
      </el-form-item>
    </el-form>
    <div class="box-show">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 30px"
        fit
        size="mini"
        :height="tableHeight"
        align="center"
        :header-cell-style="headClass"
      >
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="部门" align="center" prop="areaName" />
        <el-table-column label="角色名" align="center" prop="name" />
        <el-table-column label="姓名" align="center" prop="label" />
        <el-table-column label="备注" align="center" prop="remark">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template v-slot="{ row }">
            {{ row.createTime | onlyDate }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template v-slot="{ row }">
            {{ row.updateTime | onlyDate }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button
              v-permission="'api:v1:role:menu'"
              size="small"
              type="text"
              icon="el-icon-setting"
              @click="handlePerms(row)"
              >权限设置</el-button
            >
            <el-button
              v-permission="'api:v1:role:update'"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              v-permission="'api:v1:role:delete'"
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <role-dialog
      :visible.sync="visible"
      :deptList="deptList"
      :id.sync="id"
      @success="getList"
    ></role-dialog>
    <perm-dialog
      :visible.sync="visiblePerm"
      :id.sync="id"
      @success="getList"
    ></perm-dialog>
  </div>
</template>

<script>
import { parseTime, deepClone, getTableHeight } from "@/utils/index";
import { formatToAreaTree } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  components: {
    RoleDialog: () => import("./RoleDialog.vue"),
    PermDialog: () => import("./PermDialog.vue"),
  },
  data() {
    return {
      id: undefined,
      deptList: [],
      permsList: [],
      query: {
        areaId: undefined,
      },
      tableData: [],
      tableHeight: 0,
      visible: false,
      visiblePerm: false,
    };
  },

  computed: {
    ...mapGetters(["areaId", "isRoot"]),
  },

  mounted() {
    this.getAreaList();
    this.getList();
    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 20 - 40 - 20;
    });
  },
  methods: {
    headClass() {
      return "text-align: center;background:#eef1f6;";
    },
    async getList() {
      this.query.createTime = "2022-02-02";
      const query = {
        query: this.query,
      };
      const { code, data } = await this.$service.role.list(query);
      if (code !== 200) return;
      this.tableData = data;
    },
    async getAreaList() {
      const { code, data } = await this.$service.area.list();
      if (this.isRoot) {
        this.deptList = formatToAreaTree(data);
      } else {
        this.deptList = formatToAreaTree(data, this.areaId, "self");
      }
    },
    /**部门筛选 */
    areaChange(val) {
      this.$refs.areaTree.toggleDropDownVisible();
      this.getList();
    },
    handleAdd() {
      this.visible = true;
    },
    handleEdit({ id }) {
      this.id = id;
      this.visible = true;
    },
    async handleDelete({ id }) {
      try {
        await this.$confirm("此操作将永久删除，是否继续", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        });
      } catch (error) {
        throw new Error(error);
      }
      const { code, msg } = await this.$service.role.delete(id);
      if (code !== 200) {
        this.$message.warning(msg);
      }
      this.$message.success("删除成功");
      this.getList();
    },
    handlePerms({ id }) {
      this.id = id;
      this.visiblePerm = true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
