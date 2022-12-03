<template>
  <div class="app-container">
    
    <el-form :model="query" label-width="80px" inline size="small" ref="form">
      <h5>商品分类</h5>
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
        <el-button type="primary" @click="handleAdd">新增商品</el-button>
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
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="部门" align="center" prop="areaName" />

      <el-table-column prop="createTime" align="center" label="创建时间">
        <template v-slot="{ row }">
         {{ row.createTime | onlyDate }}
        </template>   
       </el-table-column>
      <el-table-column prop="updateTime" align="center" label="修改时间"> 

        <template v-slot="{ row }">
         {{ row.updateTime | onlyDate }}
        </template>   
      </el-table-column>

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
    <category-dialog :visible.sync="visible" :areaTree="areaTree" :id.sync="id" @success="getList"></category-dialog>
  </div>
</template>

<script>
import { parseTime, deepClone,getTableHeight } from "@/utils/index";
import { formatToAreaTree } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  components: {
    CategoryDialog: () => import('./CategoryDialog.vue')
  },
  data() {
    return {
      id:undefined,
      areaTree: [],
      query: {
        areaId: undefined,
      },
      tableData: [],
      tableHeight:0,
      visible:false,
    };
  },

  computed: {
    ...mapGetters(["areaId","isRoot"]),
  },

  mounted() {
    this.getAreaList();
    console.log(this.isRoot,'isRoot');
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
      const { code, data } = await this.$service.category.list(this.query);
      if (code !== 200) return;
      this.tableData = data;
    },
    async getAreaList() {
      const { code, data } = await this.$service.area.list();
      if(this.isRoot) {
          this.areaTree = formatToAreaTree(data);
        }else {
          this.areaTree = formatToAreaTree(data,this.areaId,'self');
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
      const {code,msg} = await this.$service.category.delete(id)
      if(code!==200) {
        this.$message.warning(msg)
      }
      this.$message.success('删除成功')
      this.getList()
    },
  },
};
</script>
<style lang="scss" scoped></style>
