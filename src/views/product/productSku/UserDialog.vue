<template>
  <el-modal
    :visible="visible"
    @submit="handleSubmit"
    @close="close"
    center
    :close-on-click-modal="false"
    btn
    width="40%"
    :title="this.id ? '编辑规格' : '新增规格'"
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
      <el-form-item label="选择商品：" prop="productSpuId">
        <el-select placeholder="请选择商品">
          <el-option
              v-for="item in spuList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
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
   
    return {
      userForm: {
        
      },
      rules: {
        
      },
      imageUrl:'',
      headers:{
        Authorization:'Bearer ' + getToken(),
      },
      spuList:[],
    };
  },
  watch: {
    visible(val) {
      val && this.id && this.getDetail(this.id);
      val && this.getSpuList();
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
    async getSpuList() {
      const {code,data} = await this.$service.spu.list()
      if(code!==200) return;
      this.spuList = data;
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