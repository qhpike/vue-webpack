<template>
  <div class="container">
    <el-form ref="form" inline>
      <h5>订单管理</h5>
      <el-form-item label="注册日期：">
        <date-range v-model="query.createTime" @change="querySearch"></date-range>
      </el-form-item>

      <el-form-item>
        <el-input v-model="query.nickName" prefix-icon="el-icon-search" placeholder="用户名"
          @change="querySearch" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.phone" style="width: 210px !important" prefix-icon="el-icon-search"
          placeholder="手机号" @change="querySearch" clearable></el-input>
      </el-form-item>

    </el-form>
    <div class="box-show">
      <el-table :data="list" fit :height="tableHeight" tooltip-effect="light" v-loading="loading">
        <el-table-column prop="id" label="编号"> </el-table-column>
        <el-table-column prop="nickName" label="用户">
        </el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>

        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template v-slot="{ row }">
            {{row.createTime | dateTime }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最近登录">
          <template v-slot="{ row }">
            {{row.updateTime | dateTime }}
          </template>
        </el-table-column>

      </el-table>

      <Pagination :page="params.page" :pageSize="params.pageSize" :total="total"
        @change="pageChange" />

    </div>
  </div>
</template>

<script>
import { parseTime, deepClone, getTableHeight } from "@/utils/index";
export default {
  components: {
  },
  data() {
    return {
      loading: false,
      list: [],
      params: {
        page: 1,
        pageSize: 20,
      },
      custQuery: "", //模糊查询
      query: {
        createTime: "",
        phone: "",
        nickName: "",
      },

      total: 0,
      tableHeight: undefined,
    };
  },
  mounted() {
    this.getData();

    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 52 - 20 - 40;
    });
  },
  methods: {
    async getData() {
      this.loading = true;
      const params = this.getParams();
      params.params.pageSize = 2;
      const { code, data } = await this.$service.wxUser.list(params);
      if (code !== 200) return;
      this.list = data.result;
      this.total = data.total;
      this.loading = false;
    },
    /**查询(分页) */
    pageChange(val) {
      this.params = val;
      this.getData();
    },
    /**查询（分页除外） */
    querySearch() {
      this.params.page = 1;
      this.getData();
    },
    /**查询参数处理 */
    getParams() {
      const query = JSON.parse(JSON.stringify(this.query));
      for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
          if (!query[key] && query[key] !== 0) {
            delete query[key];
          }
        }
      }
      return {
        params: this.params,
        query: query,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 1px 13px 1px rgba(62, 72, 160, 0.1);
  border-radius: 20px 20px 20px 20px;
  opacity: 0.1;
}
.page-container {
  display: flex;
  div:first-of-type {
    color: #333333;
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding-bottom: 15px;
  }
  div:last-of-type {
    width: 30%;
  }
}
</style>