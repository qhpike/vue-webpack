<!--
 * @Author: akexian
 * @Date: 2022-09-15
 * @Description: 
-->
<template>
  <!-- <div class="container">
        <div class="box-show">
            <el-table height="400">
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
                <el-table-column label="test"></el-table-column>
            </el-table>
            
        </div>
    </div> -->
  <div style="width: 400px; height: 400px; position: relative">
    <!-- <PicZoom  :url="baseUrl+avatar" :scale="3"/> -->
    <word-cloud></word-cloud>
    <seam-less :list-data="listData"></seam-less>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    PicZoom: () => import("@/components/zoom/PicZoom.vue"),
    WordCloud: () => import("@/components/WordCloud/index.vue"),
    SeamLess: () => import("@/components/SeamLess/index.vue"),
  },
  data() {
    return {
      baseUrl: MYURL.BASE_SERVER,
      listData: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"]),
  },
  mounted() {
    this.getSeamList()
  },
  methods: {
    async getSeamList() {
      const params = {
        params: {
          page: 1,
          pageSize: 20,
        }
      }
      const { code, data } = await this.$service.order.list(params);
      if (code !== 200) return;
      this.listData = data.result;

    }
  }
};
</script>
