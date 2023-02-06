<template>
  <div class="app-container">
    <el-form :model="query" label-width="80px" inline size="small" ref="form">
      <h5>规格管理</h5>
      <div class="form-box">
        <div>
          <el-form-item label="创建日期：">
            <date-range v-model="query.createTime" @change="getList"></date-range>
          </el-form-item>

          <el-form-item prop="productSpuId">
            <el-select v-model="query.productSpuId" filterable style="width: 150px" size="small" clearable
              placeholder="请选择商品" @change="getList">
              <el-option v-for="item in spuList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="query.isOnsale" style="width: 150px" clearable placeholder="请选择是否上架" @change="getList">
              <el-option label="上架" :value="1"></el-option>
              <el-option label="下架" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="query.isHot" style="width: 150px" clearable placeholder="请选择是否热销" @change="getList">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="query.isNew" style="width: 150px" clearable placeholder="请选择是否新品" @change="getList">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getList" type="primary" plain>搜索</el-button>
          </el-form-item>
        </div>
        <div style="float: left">
          <el-form-item label="">
            <el-button type="primary" @click="handleAdd">新增规格</el-button>
            <el-button type="primary" @click="getList('export')">导出</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table :data="tableData" style="width: 100%" fit size="mini" :height="tableHeight" align="center"
      v-loading="loading" :header-cell-style="headClass">
      <el-table-column label="规格" align="center" prop="name" />
      <el-table-column label="商品" align="center" prop="spuObj.name" />
      <el-table-column label="分类" align="center" prop="categoryObj.name" />
      <el-table-column label="售价" align="center" prop="price"></el-table-column>
      <el-table-column label="划线价" align="center" prop="origPrice">
        <template v-slot="{ row }">
          <span v-if="row.origPrice && parseInt(row.origPrice) !== 0">{{
            row.origPrice
          }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock" align="center"></el-table-column>

      <el-table-column prop="isHot" align="center" label="热销">
        <template v-slot="{ row }">
          <span>{{ row.isHot === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isNew" align="center" label="新品">
        <template v-slot="{ row }">
          <span>{{ row.isNew === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isOnsale" align="center" label="状态">
        <template v-slot="{ row }">
          <el-tag size="small" effect="dark" :type="row.isOnsale === 1 ? 'primary' : 'info'">{{
            row.isOnsale === 1 ?
              "上架" : "下架"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建日期" align="center">
        <template v-slot="{ row }">
          {{ row.createTime | onlyDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template v-slot="{ row }">
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="text" icon="el-icon-delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 20px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="params.page" :page-sizes="[2, 5, 10, 20, 50, 100]" :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <sku-dialog :visible.sync="visible" :id.sync="id" :spu-list="spuList" @success="getList"></sku-dialog>
  </div>
</template>

<script>
import { getTableHeight, downloadBuffer } from "@/utils/index";

export default {
  components: {
    SkuDialog: () => import("./SkuDialog.vue"),
    ChunkUpload: () => import('@/components/ChunkUpload')
  },
  data() {
    return {
      id: undefined,
      query: {
        productSpuId: undefined,
        isOnsale: undefined,
        isHot: undefined,
        isNew: undefined,
        createTime: "",
      },
      tableData: [],
      spuList: [],
      total: 100,
      params: {
        page: 1,
        pageSize: 5,
      },
      tableHeight: 0,
      visible: false,
      loading: false,
      myUrl: '',
      msg: '',
    };
  },

  mounted() {
    this.getList();
    this.getSpuList();
    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form);
    });
  },
  methods: {
    headClass() {
      return "text-align: center;background:#eef1f6;";
    },
    async getSpuList() {
      const { code, data } = await this.$service.spu.select();
      if (code !== 200) return;
      this.spuList = data;
    },
    async getList(type) {
      this.loading = true;
      for (const key in this.query) {
        if (Object.hasOwnProperty.call(this.query, key)) {
          if (!this.query[key] && this.query[key] !== 0) {
            this.query[key] = undefined;
          }
        }
      }
      const params = {
        query: this.query,
        params: this.params,
      };
      if (type === 'export') {
        const res = await this.$service.sku.export(params)
        downloadBuffer(res.data.data)

      } else {
        const { code, data } = await this.$service.sku.list(params);
        if (code !== 200) return;
        this.tableData = data.result;
        this.total = data.total;
      }

      this.loading = false;
    },
    handleSizeChange(val) {
      this.params.pageSize = Number(val);
      this.getList();
    },
    handleCurrentChange(val) {
      this.params.page = Number(val);
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
      const { code, msg } = await this.$service.sku.delete(id);
      if (code !== 200) {
        this.$message.warning(msg);
      }
      this.$message.success("删除成功");
      this.getList();
    },
 
  },
};
</script>
<style lang="scss" scoped>
.form-box {
  display: flex;
  justify-content: space-between;
}
</style>
