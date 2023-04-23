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
      ref="skuForm"
      :model="skuForm"
      :validate-on-rule-change="false"
      :rules="rules"
      status-icon
      size="small"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="选择商品：" prop="productSpuId">
        <el-select v-model="skuForm.productSpuId" placeholder="请选择商品">
          <el-option
            v-for="item in spuList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="规格名称：" prop="name">
        <el-input
          v-model="skuForm.name"
          placeholder="规格名称"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="售价：" prop="price">
        <el-input
          v-model="skuForm.price"
          placeholder="售价"
          oninput="value = value.replace(/[^\d.]/g,'');value =value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="单位：" prop="unit">
        <el-input
          v-model="skuForm.unit"
          placeholder="单位"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="划线价：" prop="origPrice">
        <el-input
          v-model="skuForm.origPrice"
          placeholder="划线价"
          oninput="value = value.replace(/[^\d.]/g,'');value =value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="库存：" prop="stock">
        <el-input
          v-model.number="skuForm.stock"
          placeholder="库存"
          clearable
          oninput="value = value.replace(/[^\d.]/g,'')"
        ></el-input>
      </el-form-item>

      <el-form-item label="是否上架：" prop="isOnsale" style="width: 315px">
        <el-switch
          v-model="skuForm.isOnsale"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="是否热门：" prop="isHot">
        <div style="width: 215px">
          <el-switch
            v-model="skuForm.isHot"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </div>
      </el-form-item>

      <el-form-item label="是否新品：" prop="isNew" style="width: 315px">
        <el-switch
          v-model="skuForm.isNew"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
    </el-form>
  </el-modal>
</template>

<script>
import { getToken } from "@/utils/auth";
import { validPhone } from "@/utils/validate";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    spuList: [],
    id: undefined,
  },
  data() {
    return {
      skuForm: {
        productSpuId: undefined,
        name: "",
        unit: "",
        price: "",
        origPrice: "",
        stock: 0,
        isOnsale: 1,
        isHot: 0,
        isNew: 0,
      },
      rules: {
        productSpuId: [
          { required: true, message: "必须选择商品", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        unit: [{ required: true, message: "请输单位", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        stock: [{ required: true, message: "请输入库存", trigger: "blur" }],
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
        this.$refs.skuForm.clearValidate();
      });
    },
    async handleSubmit() {
      await this.$refs.skuForm.validate();
      const skuForm = JSON.parse(JSON.stringify(this.skuForm));
      delete skuForm.checkPass;
      if (!skuForm.origPrice) {
        skuForm.origPrice = undefined; //划线价判空
      }
      if (!skuForm.price) {
        skuForm.price = undefined; //划线价判空
      }
      if (this.id) {
        const { code } = await this.$service.sku.update(
          this.skuForm.id,
          skuForm
        );
        if (code !== 200) return;
      } else {
        const { code } = await this.$service.sku.create(skuForm);
        if (code !== 200) return;
      }
      this.$message.success(this.id ? "修改成功" : "添加成功");
      this.$emit("success");
      this.close();
    },

    async getDetail(id) {
      const { code, data } = await this.$service.sku.detail(id);
      this.skuForm = data;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>