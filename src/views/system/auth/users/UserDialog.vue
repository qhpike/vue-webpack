<template>
  <el-modal
    :visible="visible"
    @submit="handleSubmit"
    @close="close"
    :close-on-click-modal="false"
    btn
    width="23%"
    title="新增用户"
  >
    <el-form
      ref="userForm"
      :model="userForm"
      :rules="userRules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="部门：" prop="areaId">
        <el-cascader
          v-model="userForm.areaId"
          placeholder="请选择部门"
          :options="areaTree"
          ref="areaTree"
          :props="{
            checkStrictly: true,
            label: 'name',
            value: 'id',
            emitPath: false,
            multiple: false,
          }"
          :show-all-levels="false"
          @change="areaChange"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="用户账号：" prop="username">
        <el-input
          v-model.trim="userForm.username"
          placeholder="请输入账号"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户密码：" prop="password">
        <el-input
          v-model.trim="userForm.password"
          type="password"
          clearable
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkPass">
        <el-input
          v-model.trim="userForm.checkPass"
          type="password"
          clearable
          placeholder="请再次输入密码"
        />
      </el-form-item>
      <el-form-item label="手机：" prop="phone">
        <el-input
          ref="phone"
          v-model.trim="userForm.phone"
          clearable
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="角色：" prop="roleList">
      </el-form-item>

      <el-form-item label="姓名：">
        <el-input v-model.trim="userForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="昵称：">
        <el-input v-model.trim="userForm.nickName" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model.trim="userForm.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
  </el-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    areaTree:[],
    id:undefined,
  },
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入6位以上用户名"));
      } else {
        const result = await this.$service.user.vlidateUser(value);
        if (result.code === 200) {
          callback();
        } else {
          callback(new Error("用户名已占用"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userForm.checkPass !== "") {
          this.$refs.userForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (validPhone(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不正确"));
      }
    };
    return {
      userForm: {
        areaId: undefined,
        username: undefined,
        password: undefined,
        checkPass: undefined,
        phone: undefined,
        name: undefined,
        nickName: undefined,
        remark: undefined,
      },
      userRules: {

      }
    };
  },
  watch: {
    visible(val) {
        val && this.id && this.getDetail(this.id)
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      console.log("close");
    },
    handleSubmit() {

    },
    /**部门选择 */
    areaChange(val) {
        this.$refs.areaTree.toggleDropDownVisible();
    },
    getDetail(id) {
        // const {code,data} = await this.$service.user.
    }
  },
};
</script>

<style lang="scss" scoped>
</style>