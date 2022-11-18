<template>
  <el-modal
    :visible="visible"
    @submit="handleSubmit"
    @close="close"
    center
    :close-on-click-modal="false"
    btn
    width="40%"
    :title="this.id ? '编辑用户' : '新增用户'"
  >
    <el-form
    inline
      ref="userForm"
      :model="userForm"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
    <el-form-item  label="用户账号：" prop="username">
        <el-input
        :disabled="Boolean(id)"
          v-model.trim="userForm.username"
          placeholder="请输入账号"
          clearable
        />
      </el-form-item>
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
      
      <el-form-item v-if="!this.id" label="用户密码：" prop="password">
        <el-input
          v-model.trim="userForm.password"
          type="password"
          clearable
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item v-if="!this.id" label="确认密码：" prop="checkPass">
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
        <el-input v-model.trim="userForm.name" placeholder="请输入姓名" />
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
       <el-form-item v-if="this.id" label="状态">
         <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
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
    areaTree: [],
    id: undefined,
  },
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (value && value.length < 6) {
        callback(new Error("用户名必须6位以上"));
      } else if(!value){
        callback(new Error('请输入用户名'))
      } else{
        console.log(value,'value')
        const result = await this.$service.user.vlidateUser(value);
        if (!result.data) {
          callback();
        } else {
          callback(new Error("用户名已存在"));
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
        username: '',
        password: undefined,
        checkPass: undefined,
        phone: undefined,
        name: undefined,
        nickName: undefined,
        remark: undefined,
      },
      rules: {
        areaId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        username: [{ validator: validateUsername, trigger: "blur" }],
      },
    };
  },
  watch: {
    visible(val) {
      val && this.id && this.getDetail(this.id);
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      Object.assign(this.$data, this.$options.data());
      this.$emit('update:id',undefined)
      this.$nextTick(()=>{
        this.$refs.userForm.clearValidate()
      })
    },
    async handleSubmit() {
      const userForm = JSON.parse(JSON.stringify(this.userForm))
      delete userForm.checkPass;
      if (this.id) {
        const { code, data } = await this.$service.user.update(userForm);
        if (code !== 200) return;
      } else {
        const { code, data } = await this.$service.user.add(userForm);
        if (code !== 200) return;
      }
      this.$message.success(this.id ? "修改成功" : "添加成功");
      this.close();
    },
    /**部门选择 */
    areaChange(val) {
      this.$refs.areaTree.toggleDropDownVisible();
    },
    async getDetail(id) {
      const { code, data } = await this.$service.user.detail(id);
      console.log(code, data);
      this.userForm = data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>