<template>
  <div>
    <div class="upload-tip">
      <slot>只能上传最多{{ limit }}jpg/png文件，且不超过500kb</slot>
    </div>
    <div class="img-container" >
      <img class="img" :src="baseUrl + imgUrl" />
      <div class="del-icon-container" tabindex="1">
        <i class="el-icon-delete del-icon" ></i>
      </div>
    </div>
    <div class="upload-icon-container" @click="$refs.file.click()">
      <i v-if="fileList.length < limit" class="el-icon-plus upload-icon"></i>
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
    limit: 0,
    action: "",
    headers: "",
    imgList: [], //用于回显
    imgUrl:'',
    fileMaxSize:{
      type:Number,
      default:0.01 //切片大小，MB
    }
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
    //分割切片
    createChunks(files,size) {
      const chunkSize = parseInt(size*1024*1024)
      let start =0,
      chunksList = [] ;
      while (start < files.size) {
        const chunkItem = files.slice(start,start + chunkSize)
        chunksList.push(chunkItem)
        start+= chunkSize
      }
      return chunksList;

    },
    //创建formData
    createFormData(list,fileName) {
      const formDataList = list.map((chunkItem,index)=>{
        const formData = new FormData()
        formData.append('file',chunkItem,fileName.split('.')[0]+'-'+index+'.'+fileName.split('.')[1])
        formData.append('fileName',fileName)
        formData.append('chunkName',index)
        return formData
      })
      return formDataList
    },
    //批量上传切片
    async uploadChunks(list,name,size) {
      const requestAll = list.map(item=>{
        return fetch(this.action,{
          method: "post",
          body: item,
          headers: this.headers,
        })
      })
      await Promise.all(requestAll)
      const data ={
        chunkSize: parseInt(size*1024*1024),
        fileName: name,

      }
      //合并切片
      const result = await this.$service.user.merge(data) 
      this.imgUrl = result.data;
    },
    async uploadFile(val) {
      console.log(this.fileMaxSize,'文件大小');
      const files = val.target.files; //原始文件
      
      const allChunkList = this.createChunks(files[0],this.fileMaxSize)
      const allFormData = this.createFormData(allChunkList,files[0].name)
      this.uploadChunks(allFormData,files[0].name,this.fileMaxSize)
    
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