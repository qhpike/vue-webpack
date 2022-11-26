<template>
  <div>
    <el-table
      :data="data"
      style="width: 100; margin-bottom: 20px"
      row-key="id"
      v-bind="$attrs"
      header-align="center"
      ref="menuTable"
      @row-click="handleRowClick"
    >
      <el-table-column label="菜单" prop="title" width="180"> </el-table-column>

      <el-table-column width="80" prop="title" >
        <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="{row}">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            >{{checkAll ?  '取消' : '全选'}}</el-checkbox
          >
        
        </template>
        <template slot="default" slot-scope="{ row }">
            <el-checkbox
            :indeterminate="row.isIndeterminate"
            v-model="row.check"
            @change="(val) => handleCheck(row, val)"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column
        label="类型"
        prop="title"
        header-align="center"
        align="center"
      >
        <template v-slot="{ row }">
          <el-tag
            size="small"
            effect="dark"
            :type="row.type === 1 ? 'primary' : 'warning'"
            >{{ row.type === 1 ? "菜单" : "权限" }}</el-tag
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "tree-table",
  model: {
    prop:'menu',
    event:'change'
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    menu: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      initFlag:true, //回显角色菜单权限标记
    };
  },
  watch:{
    menu(val) {
      if(val && val.length && this.initFlag) {
        this.allCheckedSet(val);
        this.initFlag = false; //如果状态机为false，不再回显示
      }
    },
    visible(val) {
      console.log('visible-change');
        this.initFlag = true;

    }
  },
  computed:{
    checkAll: { //全选状态
      get() {
        return this.data.every(item=>item.check)
      },
      set(val) {
        this.handleCheckAllChange(val);
      }
    },
    isIndeterminate() { //全选checkbox半选状态
      return this.data.some(item=>item.isIndeterminate)
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.data.forEach((item) => {
        this.handleCheck(item,val)
      });
    },
    /**节点点击 */
    handleCheck(row, val) {
      this.coverChild(row, val); //向上级执行
      this.coverFamily(this.data, row, val); //向下级执行
      this.allCheckedGet(); //统计所有选中id
    },
    /**子节点处理 */
    coverChild(row, val) {
      row.check = val;
      const forFn = (row, val) => {
        //forFn先处理check

        if (row.children) {
          (row.children || []).forEach((element) => {
            element.check = val;
            if (element.children) {
              forFn(element, val);
            }
          });
        }
      };
      forFn(row, val);
      const forFn2 = (row) => {
        //forFn2后处理半选中状态
        this.childIndeterminate(row); //半选中状态处理
        if (row.children) {
          (row.children || []).forEach((element) => {
            forFn2(element)
          });
        }
      };
      forFn(row, val);
      forFn2(row);
    },
    /**父节点处理 */
    coverFamily(arr1, row, val) {
      const forFn = (arr, id) => {
        arr.forEach((item) => {
          if (item.id === id) {
            const allChildrenHasChecked =
              item.children && item.children.every((el) => el.check === val); //子节点是否同一状态

            if (val === true) {
              item.check = true; //如果为true,直接赋值为true
            }
            if (val === false && allChildrenHasChecked) {
              //如果所有子级跟当前值相同，且为false
              item.check = false;
            }
            this.childIndeterminate(item); //半选中状态处理
            forFn(arr1, item.parentId);
          } else if (item.children) {
            forFn(item.children, id);
          }
        });
      };
      forFn(arr1, row.id);
    },
    //半选中状态处理
    childIndeterminate(item) {
      const notAllChecked =
        item.children &&
        item.children.filter((el) => el.check).length < item.children.length &&
        item.children.filter((el) => el.check).length; //children是否为部分选中
      const hasAnyIndeterminate =
        item.children && item.children.some((el) => el.isIndeterminate); //children是否有半选中标识
      if (notAllChecked || hasAnyIndeterminate) {
        //如果children为部分选中，或children有半选中标识
        item.isIndeterminate = true;
      } else {
        item.isIndeterminate = false;
      }
    },
    //统计所有选中状态
    allCheckedGet() {
      const temp = [];

      const forFn = (arr) => {
        arr.forEach((item) => {
          item.check && temp.push(item.id);
          item.children && forFn(item.children);
        });
      };
      forFn(this.data);
      this.$emit('change',temp)
    },
    //初始化选中状态
    allCheckedSet(data) {
      const forFn = (arr) => {
        arr.forEach((item) => {
          item.check = data.includes(item.id);
          item.children && forFn(item.children);
        });
      };

      const forFn2 = (arr) => {
        arr.forEach((item) => {
          this.childIndeterminate(item);
          item.children && forFn2(item.children);
        });
      };
      forFn(this.data); //处理check
      forFn2(this.data); //处理半选中
    },
    // 切换某一行的展开状态
    handleRowClick(row, index, e) {
      this.$refs.menuTable.toggleRowExpansion(row);
     },

  },
};
</script>

<style lang="scss" scoped>
</style>