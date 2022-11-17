<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" top="6vh">
    <span slot="footer" v-if="btn">
      <el-button
        type="primary"
        @click="$emit('submit')"
        class="submit-buttons confirm-button"
        >{{ confirmBtnText }}</el-button
      >
      <el-button
        @click="$emit('close')"
        class="submit-buttons cancel-button"
        >{{ cancelBtnText }}</el-button
      >
    </span>
    <slot class="single-column" />
  </el-dialog>
</template>

<script>
export default {
  name: "el-modal",
  props: {
    btn: {
      type: Boolean,
      default: false,
    },
    confirmBtnText: {
      type: String,
      default: "提交",
    },
    cancelBtnText: {
      type: String,
      default: "取消",
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-input  {
  width: 215px !important;
}
::v-deep .el-dialog {
  position: relative;
  border-radius: 5px;
  min-height: 250px;
//   max-height: 610px;
  overflow: auto;
}
::v-deep .el-dialog__header {
  padding: 10px;
  text-align: center;
  background-color: #fff;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid #eff3fb;
}
::v-deep .el-dialog__body {
  background: #fff;
  padding: 30px !important;
  color: #000;
  font-size: 12px;
  word-break: break-all;
}
::v-deep .el-dialog__footer {
//   position: absolute;
//   bottom: 5px;
//   width: 100%;
  text-align: center;
}
.submit-buttons {
  border: 0;
  width: 150px !important;
  height: 30px !important;
  border-radius: 4px;
  font-size: 14px;
  transition: 0.1s;
  outline: 0;

  &.confirm-button {
    background: #0278dc;
    border-color: #0278dc;
    color: #fff;
  }
  &.cancel-button {
    background-color: grey !important;
    border-color: grey;
    color: #fff;
  }
}
</style>
