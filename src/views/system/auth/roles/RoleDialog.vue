<template>
  <div>
    <el-modal
      :visible="visible"
      @submit="submit"
      @close="close"
      width="25%"
      btn
      :title="this.id ? '编辑' : '新增'"
    >
      <el-form
        label-width="100px"
        label-position="right"
        size="small"
        :model="roleForm"
        :rules="rules"
        ref="roleForm"
        :validate-on-rule-change="false"
      >
        <el-form-item label="部门：" prop="areaId">
          <el-cascader
            placeholder="请选择部门"
            :options="deptList"
            v-model="roleForm.areaId"
            ref="areaTree"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'id',
              emitPath: false,
              multiple: false,
            }"
            @change="deptChange"
            :show-all-levels="false"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="名称："  prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="label">
          <el-input v-model="roleForm.label"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="roleForm.remark"></el-input>
        </el-form-item>
        
      </el-form>
    </el-modal>
  </div>
</template>

<script>
export default {
  name: "role-dialog",
  props: {
    visible: false,
    id: "",
    deptList: [],
  },
  data() {
    return {
      roleForm: {
        areaId: 1,
        name: '',
        label: '',
        remark: ''
      },
      rules: {
        areaId: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
      },
    };
  },

  watch: {
    visible(val) {
      val && this.id && this.getDetail(this.id);
    },
  },
  methods: {
    async submit() {
      await this.$refs.roleForm.validate();
      const roleData = JSON.parse(JSON.stringify(this.roleForm));
      console.log(this.roleForm, "roleForm");

      try {
        if (this.id) {
          await this.$service.role.update(roleData);
          this.$message.success("修改成功");
        } else {
          await this.$service.role.create(roleData);
          this.$message.success("添加成功");
        }
        this.$emit("success");
        this.close();
      } catch (error) {
        this.$message.error("操作失败");
      }
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("update:id", undefined);
      Object.assign(this.$data, this.$options.data());
    },
    async getDetail(id) {
      const { code, data } = await this.$service.role.detail(id);
      if (code !== 200) return;
      this.roleForm = data;
    },
    deptChange(val) {
      console.log(val,'valxx');
    }
  },
};
</script>

<style lang="scss" scoped></style>