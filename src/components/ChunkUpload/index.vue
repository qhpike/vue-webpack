<template>
  <div>
    <slot><span style="font-size: 12px">大文件上传</span></slot>
    <el-button
      v-if="fileList.length < limit"
      type="primary"
      @click="$refs.file.click()"
      >上传文件</el-button
    >
    <div v-for="(item, index) in fileList" :key="index">
      <span href="" style="color: #888888"
        >{{ item }}
        <i
          class="el-icon-delete"
          style="margin-left: 10px"
          @click="deleteFile"
        ></i>
      </span>
    </div>
    <input
      type="file"
      ref="file"
      style="display: none"
      id="input"
      @change="uploadFile"
    />
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      default: 10,
    },
    fileMaxSize: {
      type: Number,
      default: 0.01, //切片大小，MB
    },
    uploadUrl: "", //上传地址
    mergeUrl: "", //合并地址
    headers: "",
  },
  data() {
    return {
      fileList: [],
      accept: "image/*",
    };
  },

  methods: {
    //分割切片
    createChunks(files, size) {
      const chunkSize = parseInt(size * 1024 * 1024);
      let start = 0,
        chunksList = [];
      while (start < files.size) {
        const chunkItem = files.slice(start, start + chunkSize);
        chunksList.push(chunkItem);
        start += chunkSize;
      }
      return chunksList;
    },
    //创建formData
    createFormData(list, fileName) {
      const formDataList = list.map((chunkItem, index) => {
        const formData = new FormData();
        const name = fileName.replace(/(.*\/)*([^.]+).*/ig,'$2')
        const ext = fileName.replace(/.+\./,'')
        formData.append(
          "file",
          chunkItem,
          name + "-" + index + "." + ext
        );
        formData.append("fileName", fileName);
        formData.append("chunkName", index);
        return formData;
      });
      return formDataList;
    },
    //批量上传切片
    async uploadChunks(list, name, size) {
      const requestAll = list.map((item) => {
        return fetch(this.uploadUrl, {
          method: "post",
          body: item,
          headers: this.headers,
        });
      });
      await Promise.all(requestAll);
      const mergeData = {
        chunkSize: parseInt(size * 1024 * 1024),
        fileName: name,
      };
      //合并切片

      const res = await fetch(this.mergeUrl, {
        method: "post",
        body: JSON.stringify(mergeData),
        headers: {
          Authorization: this.headers.Authorization,
          "Content-Type": "application/json",
        },
      });
      const { code, data } = await res.json();
      if (code !== 200) return;
      this.fileList.push(data);
      this.$emit("success", this.fileList);
    },
    async uploadFile(val) {
      const files = val.target.files; //原始文件
      const allChunkList = this.createChunks(files[0], this.fileMaxSize);
      const allFormData = this.createFormData(allChunkList, files[0].name);
      this.uploadChunks(allFormData, files[0].name, this.fileMaxSize);
    },
    deleteFile(index) {
      this.fileList.splice(index, 1);
      this.$emit("success", this.fileList);
    },
  },
};
</script>

<style lang="scss" scoped></style>
