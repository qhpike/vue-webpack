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
          v-model="imgList"
          :headers="headers"
          :action="`${baseUrl}/api/v1/user/multiple`"
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
    categoryList: [],
    id: undefined,
  },
  data() {
    return {
      spuForm: {
        name: "",
        subtitle: "",
        keywords: "",
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        categoryId: [
          { required: true, message: "请选择分类", trigger: "change" },
        ],
      },
      baseUrl: MYURL.CUSTOMER_SERVER,
      imgList: [],
      headers: {
        Authorization: "Bearer " + getToken(),
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
      this.$emit("update:id", undefined);
      this.$nextTick(() => {
        this.$refs.spuForm.clearValidate();
      });
    },
    async handleSubmit() {
      this.spuForm.imgUrl = this.imgList.join(",");
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
    /**部门选择 */
    areaChange(val) {
      // this.$refs.areaTree.toggleDropDownVisible();
      this.spuForm.role = [];
    },
    async getDetail(id) {
      const { code, data } = await this.$service.spu.detail(id);
      this.spuForm = data;
      if (data.imgUrl) this.imgList = data.imgUrl.split(",");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>