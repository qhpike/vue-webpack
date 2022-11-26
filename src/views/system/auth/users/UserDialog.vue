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
      :validate-on-rule-change="false"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="用户账号：" prop="username">
        <el-input
          :disabled="Boolean(id)"
          v-model="userForm.username"
          placeholder="请输入账号"
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
        <el-select v-model="userForm.role" multiple placeholder="请选择">
            <el-option
              v-for="item in roleListFilter"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
      </el-select>
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
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:3000/api/v1/user/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <template v-if="imageUrl">
            <video v-if="imageUrl.split('.')[1] === 'mp4'" :src="baseUrl + imageUrl" autoplay  class="avatar"></video>
            <img v-else :src="baseUrl + imageUrl" class="avatar" />
          </template>
          
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          
        </el-upload>
      </el-form-item>
    </el-form>
  </el-modal>
</template>

<script>
import {getToken} from '@/utils/auth'
import { validPhone } from '@/utils/validate'
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
      } else if (!value) {
        callback(new Error("请输入用户名"));
      } else {
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
      } else if (value !== this.userForm.password) {
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
        avatar:undefined,
        role:undefined,
      },
      rules: {
        areaId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        username: [
          { required: true, validator: validateUsername, trigger: "blur" },
        ],
        password: [{required: true, validator: validatePass, trigger: 'blur'}],
        checkPass:[{required: true, validator: validatePass2, trigger: 'blur'}],
        phone: [{ required: true, validator: validatePhone, trigger: 'blur' }]
      },
      baseUrl: MYURL.CUSTOMER_SERVER,
      imageUrl:'',
      headers:{
        Authorization:'Bearer ' + getToken(),
        responseType : 'blob'
      },
      roleList:[],
    };
  },
  watch: {
    visible(val) {
      val && this.id && this.getDetail(this.id);
      val && this.getRoleList();
    },
    'userForm.areaId': {
      handler(val) {
        console.log(val,'areaid--change');
      }
    }
  },
  computed: {
    roleListFilter() {
     return (this.roleList || []).filter(item=>item.areaId === this.userForm.areaId )
    }
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      // Object.assign(this.$data.userForm, this.$options.data().userForm);
      Object.assign(this.$data,this.$options.data())
      this.$emit("update:id", undefined);
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate();
      });
    },
    async handleSubmit() {
      const userForm = JSON.parse(JSON.stringify(this.userForm));
      delete userForm.checkPass;
      if (this.id) {
        const { code, data } = await this.$service.user.update(userForm);
        if (code !== 200) return;
      } else {
        const { code, data } = await this.$service.user.add(userForm);
        if (code !== 200) return;
      }
      this.$message.success(this.id ? "修改成功" : "添加成功");
      this.$emit('success')
      this.close();
    },
    async getRoleList() {
      const query = {
        createTime : '2022-02-02'
      }
      const {code,data} = await this.$service.role.list({query});
      if(code!==200) return;
      this.roleList = data;
    },
    /**部门选择 */
    areaChange(val) {
      // this.$refs.areaTree.toggleDropDownVisible();
      this.userForm.role = [];
    },
    async getDetail(id) {
      const { code, data } = await this.$service.user.detail(id);
      data.role = data.role.map(item=>item.roleId);
      this.userForm = data;
      this.imageUrl = data.avatar
    },
    handleAvatarSuccess(res,file) {
      // const arrayBuffer = this.toArrayBuffer(file.response.file.buffer.data)
      // const blob2 = new Blob([arrayBuffer])
      // this.imageUrl = URL.createObjectURL(blob2)
      this.userForm.avatar = res.data.url;
      this.imageUrl = res.data.url;

    },
    beforeAvatarUpload(file) {
      //  const isJPG = file.type === 'image/jpeg';
      //   const isLt2M = file.size / 1024 / 1024 < 2;

      //   if (!isJPG) {
      //     this.$message.error('上传头像图片只能是 JPG 格式!');
      //   }
      //   if (!isLt2M) {
      //     this.$message.error('上传头像图片大小不能超过 2MB!');
      //   }
      //   return isJPG && isLt2M;
      return true;
    },
    toArrayBuffer(buf) {
      // 方法1
    //   console.log(buf,buf.length,'length')
    // const ab = new ArrayBuffer(buf.length);
    // const view = new Uint8Array(ab);
    // for (let i = 0; i < buf.length; ++i) {
    //     view[i] = buf[i];
    // }
    // return ab;
    // 方法2
    return new Int8Array(buf)
}
  },
};
</script>

<style lang="scss" scoped>
::v-deep.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
 ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 ::v-deep .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 52px;
    height: 52px;
    line-height: 52px;
    text-align: center;
  }
 ::v-deep .avatar {
    width: 52px;
    height: 52px;
    display: block;
  }
</style>