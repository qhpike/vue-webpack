<template>
  <div>
    <el-table
      :data="roles"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180"
      />
    </el-table>
  </div>
</template>

<script>
export default {
    props: {
        roles: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {}
    },
    mounted() {
        console.log(this.roles, 'begin')
    },

    methods: {
        async getMenuTree() {
            const { data } = await this.$service.area.list()
            console.log(data, 'all menu')
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
