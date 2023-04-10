<template>
  <el-modal
    :visible="visible"
    @close="close"
    center
    :close-on-click-modal="false"
    width="25%"
    title="订单详情"
  >
    <!-- <el-form>
      <el-form-item label="订单号">
        <el-input readonly="" v-model="order.orderId"></el-input>
      </el-form-item>
    </el-form> -->
    <el-descriptions :column="1" colon size="medium">
      <el-descriptions-item label="用户名">kooriookami</el-descriptions-item>
      <el-descriptions-item label="手机号">18100000000</el-descriptions-item>
      <el-descriptions-item label="居住地">苏州市</el-descriptions-item>
      <el-descriptions-item label="联系地址"
        >江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item
      >
    </el-descriptions>
  </el-modal>
</template>

<script>
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
  },
};
</script>

<style lang="scss" scoped>
</style>