<template>
  <div class="container">
    <el-form :model="query" label-width="80px" inline size="small" ref="form">
      <h5>商品组管理</h5>
      <div class="form-box">
        <div>
          <el-form-item label="创建日期：">
            <date-range
              v-model="query.createTime"
              @change="getList"
            ></date-range>
          </el-form-item>
          <el-form-item prop="categoryId">
            <el-select
              v-model="query.categoryId"
              placeholder="请选择分类"
              style="width: 150px"
              clearable
              @change="getList"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="名称、关键字"
              prefix-icon="el-icon-search"
              @change="getList"
              v-model="custQuery"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="getList">搜索</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="">
            <el-button type="primary" @click="handleAdd">新增商品</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <div class="box-show">
      <el-table
        :data="tableData"
        style="width: 100%"
        fit
        size="mini"
        :height="tableHeight"
        align="center"
        :cell-style="classChange"
        :header-cell-style="headClass"
      >
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="副标题" align="center" prop="subtitle" />
        <el-table-column label="图片">
          <template v-slot="{ row }">
            <template v-if="row.imgUrl">
              <viewer
                :images="row.imgUrl.split(',').map((item) => baseUrl + item)"
              >
                <img
                  v-for="(img, index) in row.imgUrl.split(',').slice(0, 5)"
                  :key="index"
                  class="img-list"
                  :src="baseUrl + img"
                  alt=""
                />
              </viewer>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center" prop="categoryObj.name" />
        <el-table-column label="关键字" align="center" prop="keywords">
        </el-table-column>
        <el-table-column label="创建日期" prop="createTime" align="center">
          <template v-slot="{ row }">
            {{ row.createTime | onlyDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right; margin-top: 20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="params.page"
          :page-sizes="[2, 5, 10, 20, 50, 100]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <spu-dialog
      :visible.sync="visible"
      :id.sync="id"
      :category-list="categoryList"
      @success="getList"
    ></spu-dialog>
  </div>
</template>

<script>
import { getTableHeight } from "@/utils/index";
import { mapGetters } from "vuex";
export default {
  components: {
    SpuDialog: () => import("./SpuDialog.vue"),
  },
  data() {
    return {
      id: undefined,
      categoryList: [],
      custQuery: undefined,
      query: {
        createTime: "",
        categoryId: undefined,
      },
      params: {
        page: 1,
        pageSize: 5,
      },
      tableData: [],

      total: 0,
      baseUrl: MYURL.BASE_SERVER,

      tableHeight: 0,
      visible: false,
    };
  },

  computed: {
    ...mapGetters(["areaId", "isRoot"]),
  },

  mounted() {
    this.getCategoryList();
    this.getList();
    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 52 - 20 - 40 - 20;
    });
  },
  methods: {
    classChange({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        return "padding:0px ;";
      } else {
        return "";
      }
    },
    headClass() {
      return "text-align: center;background:#eef1f6;";
    },
    async getList() {
      for (const key in this.query) {
        if (Object.hasOwnProperty.call(this.query, key)) {
          if (!this.query[key] && this.query[key] !== 0) {
            this.query[key] = undefined;
          }
        }
      }
      const query = {
        query: this.query,
        params: this.params,
        custQuery: this.custQuery || undefined,
      };
      const { code, data } = await this.$service.spu.list(query);
      if (code !== 200) return;
      this.tableData = data.result;
      this.total = data.total;
    },
    async getCategoryList() {
      const { code, data } = await this.$service.category.select();
      if (code !== 200) return;
      this.categoryList = data;
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
      const { code, msg } = await this.$service.spu.delete(id);
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
.block {
  display: flex;
}
.img-list {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  border-radius: 5px;
  vertical-align: middle;
}
</style>
