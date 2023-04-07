<!--
 * @Author: akexian
 * @Date: 2023-03-30
 * @Description: 
-->
<template>
  <div class="container">
    <el-form ref="form" inline>
      <el-form-item>
        <el-input prefix-icon="el-icon-search" placeholder="订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input></el-input>
      </el-form-item>
      <div>
        <el-form-item>
          <el-radio-group v-model="form.status" @change="statusChange">
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
      <el-table :data="list" fit :height="tableHeight" tooltip-effect="light">
        <el-table-column prop="orderId" label="订单号"> </el-table-column>
        <el-table-column prop="userObj.nickName" label="用户">
        </el-table-column>
        <el-table-column prop="receivAble" label="订单金额"> </el-table-column>
        <el-table-column prop="actualAmount" label="实收"> </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="invoiceStatus" label="支付状态" align="center">
          <template v-slot="{ row }">
            <div :class="row.invoiceStatus === 0 ? 'error-text' : 'success-text'">
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
      <div style="text-align: right; margin-top: 20px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="params.page" :page-sizes="[2, 5, 10, 20, 50, 100]"
          :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
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
      list: [],
      params: {
        page: 1,
        pageSize: 20,
      },
      form: {
        status: 99
      },
      total: 0,
      tableHeight: undefined,
    };
  },
  mounted() {
    this.has = false;
    this.getData();

    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 52 - 20 - 40;
    });
  },
  methods: {
    async getData() {
      const { code, data } = await this.$service.order.list();
      if (code !== 200) return;
      this.list = data.result;
      this.total = data.total;
      console.log(code, data);
    },
    getStatus(val) {
      return status.get(val);
    },
    handleSizeChange() { },
    handleCurrentChange() { },
    statusChange(val) {
      console.log(val, 'status-tab-change');
    }
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