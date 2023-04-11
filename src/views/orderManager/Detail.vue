<!--
 * @Author: akexian
 * @Date: 2023-04-11
 * @Description: 
-->
<template>
  <el-modal :visible="visible" @close="close" center :close-on-click-modal="false" width="40%"
    title="订单详情">
    <el-form label-width="80px" inline class="content-font" label-suffix="：" label-position="left">
      <el-row>
        <el-col :span="12">
          <el-form-item label="订单号">{{order.orderId}}</el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">{{getStatus(order.status)}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="订单金额">¥{{order.receivAble}}</el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="实收金额">¥{{order.actualAmount || '0.00'}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="支付状态">
            <span :class="order.invoiceStatus === 0 ? 'error-text' : 'success-text'">
              {{order.invoiceStatus ===0 ? '待支付' : '已支付'}}
            </span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="下单时间">{{order.createTime | DateTime }}</el-form-item>

        </el-col>
        <el-col :span="12" v-if="order.invoiceStatus === 1">
          <el-form-item label="支付时间">{{order.invoiceTime | DateTime }}</el-form-item>
        </el-col>

        <el-col :span="12" v-if="![0,1,4,5].includes(order.status)">
          <el-form-item label="发货时间">{{order.sendTime | DateTime }}</el-form-item>

        </el-col>
        <el-col :span="12" v-if="order.status === 3">
          <el-form-item label="签收时间">{{order.signingTime | DateTime }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="收货地址">{{order.address}}</el-form-item>
      </el-row>

    </el-form>
    <p>清单</p>
    <el-table :data="order.detailList" :height="150" size="mini">
      <el-table-column label="商品" prop="productSpuName">

      </el-table-column>
      <el-table-column label="规格" prop="productSkuName">

      </el-table-column>
      <el-table-column label="数量" prop="count">

      </el-table-column>
      <el-table-column label="单位" prop="skuUnit">

      </el-table-column>
      <el-table-column label="单价" prop="price">

      </el-table-column>
    </el-table>
  </el-modal>
</template>

<script>
const status = new Map()
  .set(0, "待付款")
  .set(1, "待发货")
  .set(2, "待收货")
  .set(3, "订单完成")
  .set(4, "订单取消")
  .set(5, "订单关闭");
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      order: {},
    };
  },
  watch: {
    visible(val) {
      val && this.getDetail();
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
    },
    async getDetail() {
      const { code, data } = await this.$service.order.detail(this.id);
      if (code !== 200) return;
      this.order = data;
    },
    getStatus(val) {
      return status.get(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.content-font {
  font-size: 12px;
}
</style>