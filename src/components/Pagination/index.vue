<template>
  <div style="text-align: right; margin-top: 20px">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[2, 5, 10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("change", {
        page: val,
        pageSize: this.pageSize,
      });
    },
    handleSizeChange(val) {
      this.$emit("change", {
        page: this.page,
        pageSize: val,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>