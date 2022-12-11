<template>
  <div>
    <el-date-picker
      v-model="dateTime"
      type="daterange"
      size="small"
      style="width: 215px"
      range-separator="至"
      :default-time="['00:00:00', '23:59:59']"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="center"
      @change="dateChange"
    >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: String,
      default: "",
    },
  },
  model: {
    prop: "date",
    event: "timeChange",
  },
  data() {
    return {
      dateTime: [],
    };
  },
  methods: {
    dateChange(val) {
      if(val) {
        this.$emit("timeChange", val.join("_"));
      } else {
        this.$emit('timeChange',val)
      }
      this.$emit("change", val);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>