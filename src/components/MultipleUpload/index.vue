<template>
  <div>
    <div class="upload-tip">
      <slot>只能上传最多{{ limit }}jpg/png文件，且不超过500kb</slot>
    </div>
    <div class="img-container" v-for="(item, index) of fileList" :key="item.uid">
      <img class="img" :src="item.blob || baseUrl + item.url" />
      <div class="del-icon-container" tabindex="1">
        <i class="el-icon-delete del-icon" @click="deleteImg(index)"></i>
      </div>
    </div>
    <div class="upload-icon-container" @click="$refs.file.click()">
      <i v-if="fileList.length < limit" class="el-icon-plus upload-icon"></i>
    </div>

    <input
      type="file"
      ref="file"
      style="display: none"
      :accept="accept"
      id="input"
      @change="uploadFile"
      multiple="multiple"
    />
  </div>
</template>

<script>
export default {
  props: {
    limit: 0,
    action: "",
    headers: "",
    imgList: [], //用于回显
  },
  model: {
    prop: "imgList",
    event: "change",
  },
  data() {
    return {
      fileList: [],
      accept: "image/*",
    };
  },
  watch: {
    imgList(val) {
      console.log(val,'val-img');
      if(val.length===0) {
        this.fileList =[]
      }
      if (this.fileList && this.fileList.length) return; //返回，避免请求图片
      this.fileList = val.map((item, index) => {
        const uid = Date.now()+''+Math.ceil(Math.random()*1000)+''
        return {
          uid,
          url: item,
          blob: "",
        };
      });
    },
  },
  computed: {
    baseUrl() {
      const baseUrl = new URL(this.action);
      return baseUrl.origin;
    },
  },
  methods: {
    async uploadFile(val) {
      const files = val.target.files; //原始文件
      const form = new FormData();
      for (const key in files) {
        if (Object.hasOwnProperty.call(files, key)) {
          form.append("file", files[key]);
        }
      }
      const options = {
        method: "post",
        body: form,
        headers: this.headers,
      };
      const url = this.action;
      const res = await fetch(url, options);
      const body = await res.json();
      const fileList = body.data.map((item, index) => {
        //上传返回列表
        const uid = Date.now()+''+Math.ceil(Math.random()*1000)+''
        return {
          uid,
          url: item.url,
          blob: this.generateLocalUrl(files[index]),
        };
      });
      this.fileList = this.fileList.concat(fileList);
      const relativePath = this.fileList.map((item) => item.url);
      this.$emit("change", relativePath);
    },
    deleteImg(index) {
      this.fileList.splice(index, 1);
      const relativePath = this.fileList.map((item) => item.url);
      this.$emit("change", relativePath);
    },
    generateLocalUrl(file) {
      const url = URL.createObjectURL(file);
      return url;
    },
  },
};
</script>

<style lang="scss" scoped>
.img-container {
  width: 52px;
  height: 52px;
  margin-right: 5px;
  border-radius: 6px;
  position: relative;
  display: inline-block;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 6px;
  }
  .del-icon-container {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    text-align: center;
    background: rgba($color: #000000, $alpha: 0.5);
    transition: all 0.5s;

    &:hover {
      opacity: 1;
    }
    .del-icon {
      margin: auto;
      color: white;
      line-height: 52px;
    }
  }
}
.upload-icon-container {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: center;
  display: inline-block;
  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    width: 52px;
    height: 52px;
    line-height: 52px;
  }
}
.upload-tip {
  font-size: 12px;
  color: #606266;
}
</style>