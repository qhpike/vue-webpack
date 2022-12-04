<template>
  <el-modal
    :visible="visible"
    @submit="handleSubmit"
    @close="close"
    center
    :close-on-click-modal="false"
    btn
    width="25%"
    :title="this.id ? '编辑商品组' : '新增商品组'"
  >
    <el-form
      ref="spuForm"
      :model="spuForm"
      :validate-on-rule-change="false"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="商品组名称：" prop="name">
        <el-input v-model="spuForm.name" placeholder="请输入名称" />
      </el-form-item>

      <el-form-item label="副标题：">
        <el-input v-model="spuForm.subtitle" placeholder="副标题"></el-input>
      </el-form-item>

      <el-form-item label="关键字：">
        <el-input v-model="spuForm.keywords" placeholder="逗号分割"></el-input>
      </el-form-item>

      <el-form-item label="分类：" prop="categoryId">
        <el-select v-model="spuForm.categoryId">
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="图片：">
        <multiple-upload
          limit="10"
          @success="uploadSuccess"
          v-model="imgList"
          :headers="headers"
          action="http://localhost:3000/api/v1/user/multiple"
          >最多十张图片，每张不超过2M</multiple-upload
        >
      </el-form-item>
    </el-form>
  </el-modal>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  components: {
    MultipleUpload: () => import("@/components/MultipleUpload/index.vue"),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    areaTree: [],
    id: undefined,
  },
  watch: {
    fileList(val) {
      console.log(val, "pic-val");
    },
  },
  data() {
    return {
      spuForm: {
        name: "",
        subtitle: "",
        keywords: "",
      },
      categoryList: [],
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
      },
      baseUrl: MYURL.CUSTOMER_SERVER,
      imageUrl: "",
      imgList: [],
      fileList: [],
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      categoryList: [],
    };
  },
  watch: {
    visible(val) {
      val && this.id && this.getDetail(this.id);
      val && this.getCategoryList();
    },
    fileList(val) {
      console.log(val, "list-change");
    },
    imgList(val) {
      console.log(val, "图片改变");
    },
  },
  methods: {
    close() {
      this.$emit("update:visible", false);
      // Object.assign(this.$data.spuForm, this.$options.data().spuForm);
      Object.assign(this.$data, this.$options.data());
      this.$emit("update:id", undefined);
      this.$nextTick(() => {
        this.$refs.spuForm.clearValidate();
      });
    },
    async handleSubmit() {
      this.spuForm.imgUrl = this.imgList.join(',')
      const spuForm = JSON.parse(JSON.stringify(this.spuForm));
      delete spuForm.checkPass;
      if (this.id) {
        const { code, data } = await this.$service.spu.update(spuForm);
        if (code !== 200) return;
      } else {
        const { code, data } = await this.$service.spu.create(spuForm);
        if (code !== 200) return;
      }
      this.$message.success(this.id ? "修改成功" : "添加成功");
      this.$emit("success");
      this.close();
    },
    async getCategoryList() {
      const { code, data } = await this.$service.category.list();
      if (code !== 200) return;
      this.categoryList = data;
    },
    /**部门选择 */
    areaChange(val) {
      // this.$refs.areaTree.toggleDropDownVisible();
      this.spuForm.role = [];
    },
    async getDetail(id) {
      const { code, data } = await this.$service.spu.detail(id);
      this.spuForm = data;
      this.imgList = data.imgUrl.split(',')
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file, this.fileList);
      // res.data.status = true;
      // this.fileList.push(res.data);
    },
    beforeAvatarUpload(file) {
      console.log(file, "file");
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
      return true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadSuccess(res) {
      console.log(res, "上传成功");
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
  border-color: #409eff;
}
::v-deep .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 52px;
  height: 52px;
  line-height: 52px;
  text-align: center;
  display: inline-flex;
}
::v-deep .avatar {
  width: 52px;
  height: 52px;
  display: inline-flex;
}
</style>