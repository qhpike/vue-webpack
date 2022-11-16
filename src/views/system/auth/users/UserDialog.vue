<template>
  <div>
    <el-dialog
      :title="dialogType === 'edit' ? '用户编辑' : '新增用户'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="dialogVisible"
        ref="userForm"
        :model="user"
        :rules="userRules"
        status-icon
        size="medium"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="机构" prop="area_id">
          <el-cascader
            ref="areaTree"
            v-model="user.area_id"
            :disabled="dialogType !== 'new'"
            :options="newArea.data"
            :props="newArea.defaultProps"
            clearable
            :show-all-levels="false"
            placeholder="请选择机构"
            @change="toggleDropDown"
          />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input
            v-model.trim="user.username"
            placeholder="请输入账号"
            clearable
            :disabled="dialogType !== 'new'"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="user.password"
            type="password"
            clearable
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input
            v-model.trim="user.checkPass"
            type="password"
            clearable
            placeholder="请再次输入密码"
          />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input
            ref="phone"
            v-model.trim="user.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleList">
          <el-cascader
            v-model="user.roleList"
            :options="allRole.data"
            :props="allRole.defaultProps"
            clearable
            :show-all-levels="false"
            placeholder="请选择角色"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model.trim="user.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model.trim="user.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="user.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('userForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
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
        if (this.user.checkPass !== "") {
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
      user: {
        id: null,
        area_id: null,
        username: "",
        password: "",
        checkPass: "",
        name: "",
        phone: "",
        nick_name: "",
        avatar:
          "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3866513739,3961195204&fm=26&gp=0.jpg",
        remark: "",
        roleList: [],
      },
    };
  },
};
</script>

<style lang="scss" scoped>
</style>