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
        :model="deptForm"
        :rules="rules"
        ref="deptForm"
        :validate-on-rule-change="false"
      >
        <el-form-item label="上级部门：" prop="parentId">
          <el-cascader
            placeholder="请选择部门"
            :options="deptList"
            v-model="deptForm.parentId"
            ref="areaTree"
            :disabled="Boolean(id)"
            :props="{
              checkStrictly: true,
              label: 'name',
              value: 'id',
              emitPath: true,
              multiple: false,
            }"
            :show-all-levels="false"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="部门名称：" size="small" prop="name">
          <el-input v-model="deptForm.name"></el-input>
        </el-form-item>
      </el-form>
    </el-modal>
  </div>
</template>

<script>
export default {
  name: "dept-dialog",
  props: {
    visible: false,
    id: "",
    deptList: [],
  },
  data() {
    return {
      deptForm: {
        parentId: [1],
        name: "",
        ancestors: "",
      },
      rules: {
        parentId: [
          { required: true, message: "请选择上级部门", trigger: "change" },
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
      await this.$refs.deptForm.validate();
      const deptData = JSON.parse(JSON.stringify(this.deptForm));
      console.log(this.deptForm, "deptForm");

      try {
        if (this.id) {
          delete deptData.parentId;
          await this.$service.area.update(deptData);
          this.$message.success("修改成功");
        } else {
          deptData.ancestors = "0," + deptData.parentId.join(",");
          deptData.parentId = deptData.parentId.pop();
          console.log(deptData,'data-after')
          await this.$service.area.create(deptData);
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
      const { code, data } = await this.$service.area.detail(id);
      if (code !== 200) return;
      this.deptForm = data;
    },
  },
};
</script>

<style lang="scss" scoped></style>
