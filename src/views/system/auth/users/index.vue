<template>
  <div class="app-container">
    <el-form :model="query" label-width="80px" inline size="small" ref="form">
      <el-form-item label="部门:">
        <el-cascader
          v-model="query.areaId"
          placeholder="请选择部门"
          :options="areaTree"
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
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 30px"
      fit
      size="small"
      :height="tableHeight"
      align="center"
      :header-cell-style="headClass"
    >
      <el-table-column label="id" prop="id"> </el-table-column>
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="电话" prop="phone" />
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="部门" prop="areaName"> </el-table-column>
      <el-table-column label="部门次序" prop="ancestors" />
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          <span>{{ row.status === 1 ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注"> </el-table-column>

      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:right;margin-top:20px;">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="params.page"
      :page-sizes="[2,5,10,20,50,100]"
      :page-size="params.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    </div>
    <user-dialog :visible.sync="visible" :areaTree="areaTree" :id="id"></user-dialog>
  </div>
</template>

<script>
import { parseTime, deepClone,getTableHeight } from "@/utils/index";
import { formatRouterTree } from "@/utils/routerHook";
import { validPhone } from "@/utils/validate";
import { mapGetters } from "vuex";
import { contain } from 'postcss-pxtorem/lib/filter-prop-list';
export default {
  components: {
    UserDialog: () => import('./UserDialog.vue')
  },
  data() {
    return {
      id:undefined,
      areaTree: [],
      query: {
        areaId: undefined,
      },
      tableData: [],
      total: 100,
      params: {
        page: 1,
        pageSize: 5,
      },
      tableHeight:0,
      visible:false,
    };
  },

  computed: {
    ...mapGetters(["areaid"]),
  },

  mounted() {
    this.getAreaList();
    this.getList();
    this.$nextTick(()=>{
      this.tableHeight = getTableHeight(this.$refs.form)
    })
  },
  methods: {
    headClass() {
      return "text-align: center;background:#eef1f6;";
    },
    async getList() {
      this.query.createTime = "2022-02-02";
      const query = {
        query:this.query,
        params:this.params,
      }
      const { code, data } = await this.$service.user.list(query);
      if (code !== 200) return;
      this.tableData = data.result;
      this.total = data.total;
    },
    async getAreaList() {
      const { code, data } = await this.$service.area.list();
      this.areaTree = formatRouterTree(data);
      console.log(code, data);
    },
    handleSizeChange(val) {
      this.params.pageSize = Number(val);
      console.log(val, "val-size");
      this.getList()
    },
    handleCurrentChange(val) {
      this.params.page = Number(val);
      console.log(this.params.pageSize,'params')
      console.log(val, "val-page");
      this.getList()
    },
    /**部门筛选 */
    areaChange(val) {
      this.$refs.areaTree.toggleDropDownVisible();
      this.getList();
    },
    handleAdd() {
      this.visible = true;
    },
    handleEdit({id}) {
      this.id = id;
      this.visible = true;
    },
    handleDelete({id}) {

    }
  },
};
</script>
<style lang="scss" scoped></style>
