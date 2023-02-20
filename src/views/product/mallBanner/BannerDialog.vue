<template>
  <el-modal
    :visible="visible"
    @submit="handleSubmit"
    @close="close"
    center
    :close-on-click-modal="false"
    btn
    width="25%"
    :title="this.id ? '编辑轮播图' : '新增轮播图'"
  >
    <el-form
      ref="bannerForm"
      :model="bannerForm"
      :validate-on-rule-change="false"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
    <el-form-item label="名称:" prop="name">
      <el-input v-model="bannerForm.name"></el-input>
    </el-form-item>
    <el-form-item label="选择商品：" prop="productSpuId">
        <el-select v-model="bannerForm.productSpuId" placeholder="请选择商品" @change="skuChange">
          <el-option
            v-for="item in spuList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        
      </el-form-item>
    <el-form-item label="选择规格：" prop="productSkuId">
        <el-select v-model="bannerForm.productSkuId" placeholder="请选择商品">
          <el-option
            v-for="item in skuList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        
      </el-form-item>
        <el-form-item label="图片">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:3000/api/v1/banner/upload"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <template v-if="bannerForm.imgUrl">
            <video v-if="bannerForm.imgUrl.split('.')[1] === 'mp4'" :src="baseUrl + bannerForm.imgUrl" autoplay  class="avatar"></video>
            <img v-else :src="baseUrl + bannerForm.imgUrl" class="avatar" />
          </template>
          
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          
        </el-upload>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="bannerForm.order" :controls="false"></el-input-number>
      </el-form-item>
      
    </el-form>
  </el-modal>
</template>

<script>
const bannerForm = {
        name:'',
        productSpuId:'',
        productSkuId:'',
        imgUrl:'',
        order:0,
      }
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
      bannerForm: {
        name:'',
        productSpuId:'',
        productSkuId:'',
        imgUrl:'',
      },
      spuList:[],
      skuList:[],
      rules: {
        productSpuId:[{required:true,message:'请选择商品',trigger:'change'}],
        productSkuId:[{required:true,message:'请选择规格',trigger:'change'}],
      },
      baseUrl: MYURL.CUSTOMER_SERVER,
      headers:{
        Authorization:'Bearer ' + getToken(),
      },
    };
  },
  watch: {
    visible(val) {
      val && this.id && this.getDetail(this.id);
    },
  },
  mounted() {
    this.getSpuList()
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      this.bannerForm = bannerForm
      this.$emit("update:id", undefined);
      this.$nextTick(() => {
        this.$refs.bannerForm.clearValidate();
      });
    },
    async handleSubmit() {
      const bannerForm = JSON.parse(JSON.stringify(this.bannerForm));
      delete bannerForm.checkPass;
      if (this.id) {
        const { code, data } = await this.$service.banner.update(this.id,bannerForm);
        if (code !== 200) return;
      } else {
        const { code, data } = await this.$service.banner.create(bannerForm);
        if (code !== 200) return;
      }
      this.$message.success(this.id ? "修改成功" : "添加成功");
      this.$emit('success')
      this.close();
    },
    async getDetail(id) {
      const { code, data } = await this.$service.banner.detail(id);
      this.getSkuList(data.productSpuId)
      this.bannerForm = data;
    },
    async getSpuList() {
      const { code, data } = await this.$service.spu.select();
      if (code !== 200) return;
      this.spuList = data;
      
    },
    async getSkuList(id) {
      const { code, data } = await this.$service.sku.select(id);
      if (code !== 200) return;
      this.skuList = data;
    },
     handleAvatarSuccess(res,file) {
      this.bannerForm.imgUrl = res.data.url;

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
    skuChange(id) {
      this.bannerForm.productSkuId = undefined //清除SKUID
      this.getSkuList(id)
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
    width: 210px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }
 ::v-deep .avatar {
    width: 210px;
    height: 70px;
    display: block;
  }
  ::v-deep .el-table .cell {
    padding: 0px;
  }
</style>