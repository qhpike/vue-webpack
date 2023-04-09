<!--
 * @Author: akexian
 * @Date: 2023-03-30
 * @Description: 
-->
<template>
  <div class="container">
    <el-form ref="form" inline>
      <h5>订单管理</h5>
      <el-form-item label="下单日期：">
        <date-range
          v-model="query.createTime"
          @change="querySearch"
        ></date-range>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.orderId"
          style="width: 210px !important"
          prefix-icon="el-icon-search"
          placeholder="订单号"
          @change="querySearch"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.nickName"
          prefix-icon="el-icon-search"
          placeholder="用户名"
          @change="querySearch"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="query.invoiceStatus"
          @change="querySearch"
          placeholder="请选择支付状态"
          clearable
        >
          <el-option label="已付款" :value="1" />
          <el-option label="未付款" :value="0" />
        </el-select>
      </el-form-item>
      <div>
        <el-form-item>
          <el-radio-group v-model="form.status" @change="querySearch">
            <el-radio-button :label="99">全部</el-radio-button>
            <el-radio-button :label="0">待付款</el-radio-button>
            <el-radio-button :label="1">待发货</el-radio-button>
            <el-radio-button :label="2">已发货</el-radio-button>
            <el-radio-button :label="3">已完成</el-radio-button>
            <el-radio-button :label="4">已取消</el-radio-button>
            <el-radio-button :label="5">已关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <div class="box-show">
      <el-table
        :data="list"
        fit
        :height="tableHeight"
        tooltip-effect="light"
        v-loading="loading"
      >
        <el-table-column prop="orderId" label="订单号"> </el-table-column>
        <el-table-column prop="userObj.nickName" label="用户">
        </el-table-column>
        <el-table-column prop="receivAble" label="订单金额"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收"> </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="invoiceStatus" label="支付状态" align="center">
          <template v-slot="{ row }">
            <div
              :class="row.invoiceStatus === 0 ? 'error-text' : 'success-text'"
            >
              {{ row.invoiceStatus === 0 ? "待支付" : "已支付" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template v-slot="{ row }">
            <span>{{ getStatus(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间">
          <template v-slot="{ row }">
            <span>{{ row.createTime | onlyDate }}</span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :page="params.page"
        :pageSize="params.pageSize"
        :total="total"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import { parseTime, deepClone, getTableHeight } from "@/utils/index";
const status = new Map()
  .set(0, "待付款")
  .set(1, "待发货")
  .set(2, "待收货")
  .set(3, "已收货")
  .set(4, "订单取消")
  .set(5, "订单关闭");
export default {
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
        orderId: "",
        nickName: "",
        invoiceStatus: "",
      },
      form: {
        status: 99,
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
      const { code, data } = await this.$service.order.list();
      if (code !== 200) return;
      this.list = data.result;
      this.total = data.total;
      this.loading = false;
      console.log(code, data);
    },
    getStatus(val) {
      return status.get(val);
    },
    pageChange(val) {
      this.params.page = val.page;
      this.params.pageSize = val.pageSize;
      this.getData();
    },

    querySearch() {
      this.params.page = 1;
      this.getData();
    },
    paginationChange(val) {
      console.log(val, "页码变动");
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
// .success-text {
//   color: $green;
// }
// .error-text {
//   color: $menuActiveText;
// }
</style>