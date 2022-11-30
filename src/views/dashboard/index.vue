<!--
 * @Author: akexian
 * @Date: 2022-09-15
 * @Description: 
-->
<template>
    <!-- <div class="app-container">
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
    <div style="width:400px;height:400px;">
         <PicZoom  :url="baseUrl+avatar" :scale="3"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    components: {
        PicZoom : () => import('@/components/zoom/PicZoom.vue')
    },
    data() {
        return {
            baseUrl: MYURL.CUSTOMER_SERVER,
        }
    },
      computed:{
            ...mapGetters([
            'sidebar',
            'avatar',
            'name',
            ])
        },
}
</script>
