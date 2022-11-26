<template>
  <el-modal
    :visible="visible"
    @submit="submit"
    @close="close"
    width="40%"
    btn
    title="菜单编辑"
  >
  <h5>选择菜单:</h5>
    <tree-table :data="permsList"  :visible="visible" v-model="menu" border height="300"></tree-table>
    
  </el-modal>
</template>

<script>
import { formatToAreaTree } from "@/utils/index";
export default {
  name: "role-dialog",
  components: {
    TreeTable: () => import('@/components/TreeTable/index.vue')
  },
  props: {
    visible: false,
    id: "",
    deptList: [],
  },
  data() {
    return {
      permsList: [],
      menu:[],
    };
  },

  watch: {
    visible(val) {
      if(val) {
        // this.getPermById(this.id)
        // this.getMenuList();
        this.initPerm()
      }
      // val && this.getMenuList();
      // val && this.getPermById(this.id)
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      this.$emit("update:id", undefined);
      Object.assign(this.$data, this.$options.data());
    },
    async getMenuList() {
        const { code, data } = await this.$service.menu.list();
      (data.roles || []).forEach(item => {
        item.isIndeterminate = false;
        item.check = false;
      });

      this.permsList = formatToAreaTree(data.roles);
    },
    getPermById(id) {
      
      return new Promise(async (resolve,reject)=>{
        const {code,data} = await this.$service.menu.findOne(id)
        this.menu = data.map(item=>item.menuId)
        resolve()
      })
    },
    async initPerm() {
      const pro1 = this.$service.menu.list();
      const pro2 =  this.$service.menu.findOne(this.id)
      const [menu,perm] = await Promise.all([pro1,pro2])
      console.log(menu,perm);
      (menu.data.roles || []).forEach(item => {
        item.isIndeterminate = false;
        item.check = false;
      });
      

      this.permsList = formatToAreaTree(menu.data.roles);
      this.menu = perm.data.map(item=>item.menuId)
      // console.log(permsList,menu,'xx-yy');
    },
    async submit() {
      const data = this.menu.map(item=>{
        return {
          roleId:this.id,
          menuId: item,
        }
      })
      await this.$service.role.saveMenu(data,this.id)
      this.$message.success('保存成功')
      this.close();
    }
  },
};
</script>

<style lang="scss" scoped>
.switch-list {
  margin: 20px 0;
  list-style: none;
  overflow: hidden;
}
.switch-item {
  margin: 20px;
  float: left;
}
</style>