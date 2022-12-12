<template>
  <div class="app-container">
    
    <el-form :model="query" label-width="80px"   size="small" ref="form">
      <h5>商品分类</h5>
      <!-- <el-form-item label="姓名">
        <el-input v-model="query.name" @change="getList"></el-input>
      </el-form-item> -->
      <el-form-item style="text-align:right;">
        <el-button  type="primary" @click="handleAdd">新增分类</el-button>
        <!-- <el-input></el-input> -->
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      style="width: 100%;"
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
    <category-dialog :visible.sync="visible" :id.sync="id" @success="getList"></category-dialog>
  </div>
</template>

<script>
import { getTableHeight } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  components: {
    CategoryDialog: () => import('./CategoryDialog.vue')
  },
  data() {
    return {
      id:undefined,
      tableData: [],
      tableHeight:0,
      visible:false,
      query:{

      }
    };
  },


  mounted() {
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
