<template>
  <el-modal
    :visible="visible"
    @submit="handleSubmit"
    @close="close"
    center
    :close-on-click-modal="false"
    btn
    width="25%"
    :title="this.id ? '编辑分类' : '新增分类'"
  >
    <el-form
      ref="categoryForm"
      :model="categoryForm"
      :validate-on-rule-change="false"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="分类编号：" prop="id" v-if="this.id">
        <el-input
          :disabled="Boolean(id)"
          v-model="categoryForm.id"
        />
      </el-form-item>
      <el-form-item label="分类名称：" prop="name">
        <el-input
          v-model="categoryForm.name"
          placeholder="请输入名称"
        />
      </el-form-item >
      <el-form-item label="图标" prop="imgUrl">
         <el-upload
          class="avatar-uploader"
          action="http://localhost:3000/api/v1/banner/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <template v-if="categoryForm.imgUrl">
            <video v-if="categoryForm.imgUrl.split('.')[1] === 'mp4'" :src="baseUrl + categoryForm.imgUrl" autoplay  class="avatar"></video>
            <img v-else :src="baseUrl + categoryForm.imgUrl" class="avatar" />
          </template>
          
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          
        </el-upload>
      </el-form-item>
      

      
  
    

      
  
    </el-form>
  </el-modal>
</template>

<script>
import {getToken} from '@/utils/auth'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: undefined,
  },
  data() {
    return {
      categoryForm: {
        name:'',
        subtitle:'',
        keywords:'',
        imgUrl:'',
      },
      categoryList:[],
      rules: {
        name:[{required:true,message:'请输入名称',trigger:'blur'}],
        categoryId:[{required:true,message:'请选择分类',trigger:'change'}]
      },
      baseUrl: MYURL.CUSTOMER_SERVER,
      imageUrl:'',
      headers:{
        Authorization:'Bearer ' + getToken(),
        responseType : 'blob'
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
      // Object.assign(this.$data.categoryForm, this.$options.data().categoryForm);
      Object.assign(this.$data,this.$options.data())
      this.$emit("update:id", undefined);
      this.$nextTick(() => {
        this.$refs.categoryForm.clearValidate();
      });
    },
    async handleSubmit() {
      const categoryForm = JSON.parse(JSON.stringify(this.categoryForm));
      delete categoryForm.checkPass;
      if (this.id) {
        const { code, data } = await this.$service.category.update(categoryForm);
        if (code !== 200) return;
      } else {
        const { code, data } = await this.$service.category.create(categoryForm);
        if (code !== 200) return;
      }
      this.$message.success(this.id ? "修改成功" : "添加成功");
      this.$emit('success')
      this.close();
    },
    async getDetail(id) {
      const { code, data } = await this.$service.category.detail(id);
      this.categoryForm = data;
      this.imageUrl = data.avatar
    },
    handleAvatarSuccess(res,file) {
      this.categoryForm.avatar = res.data.url;
      this.imageUrl = res.data.url;

    },
    beforeAvatarUpload(file) {
       const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    },
        handleAvatarSuccess(res,file) {
      this.categoryForm.imgUrl = res.data.url;

    },
    beforeAvatarUpload(file) {
       const isJPG = ['image/jpeg'].includes(file.type);
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    },
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