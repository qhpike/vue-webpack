<template>
  <div class="app-container">
    <el-form :model="query" label-width="80px" inline size="small" ref="form">
      <!-- <el-form-item label="姓名">
        <el-input v-model="query.name" @change="getList"></el-input>
      </el-form-item> -->
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
      size="mini"
      :height="tableHeight"
      align="center"
      :header-cell-style="headClass"
    >
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="部门" align="center" prop="areaName"> </el-table-column>
      <el-table-column label="部门次序" align="center" prop="ancestors" />
      <el-table-column prop="status" align="center" label="状态">
        <template v-slot="{ row }">
          <span>{{ row.status === 1 ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" align="center" label="备注"> </el-table-column>

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
    <user-dialog :visible.sync="visible" :areaTree="areaTree" :id.sync="id" @success="getList"></user-dialog>
  </div>
</template>

<script>
import { parseTime, deepClone,getTableHeight } from "@/utils/index";
import { formatToAreaTree } from "@/utils/index";
import { mapGetters } from "vuex";
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
    ...mapGetters(["areaId"]),
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
      this.query.createTime ='2022-02-02';
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
      this.areaTree = formatToAreaTree(data,this.areaId);
    },
    handleSizeChange(val) {
      this.params.pageSize = Number(val);
      this.getList()
    },
    handleCurrentChange(val) {
      this.params.page = Number(val);
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
    async handleDelete({id}) {
      try {
        await this.$confirm('此操作将永久删除，是否继续','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
      })
      } catch (error) {
        throw new Error(error)
      }
      const {code,msg} = await this.$service.user.delete(id)
      if(code!==200) {
        this.$message.warning(msg)
      }
      this.$message.success('删除成功')
      this.getList()
    }
  },
};
</script>
<style lang="scss" scoped></style>
