<!--
 * @Author: akexian
 * @Date: 2022-06-27
 * @Description: 
-->
<template>
   
    <!-- <Test> page199</Test>
    <router-link :to="{ path: '/page', params: { userId: 123 }}">User</router-link> -->
    <div class="wrapper">
      <div class="box a">A</div>
      <div class="box b">B</div>
      <div class="box c">C</div>
      <div class="box d">D</div>
    </div>

</template>

<script>
  export default {
    components:{
      Test:()=> import('@/components/Test.vue')
    },
    async mounted() {
    },
    methods: {
      goPage() {
        this.$router.push({path:'/page',query:{size:'small'}})
      }
    }
    
  }
</script>

<style lang="scss" scoped>
.wrapper {
  width: 500px !important;
  height: 500px !important;
		display: grid;
		/* grid-template-columns: [col1-start] 100px  [col2-start] 100px  [col3-start] 100px [col3-end];
		grid-template-rows: [row1-start] auto [row2-start] auto [row2-end]; */
    grid-template-columns: repeat(2,1fr);
    grid-template-rows: repeat(3,1fr);
  	grid-gap: 10px;
		color: #fff;
}
	
  .a {
		/* grid-column: col1-start / col3-start;
		grid-row: row1-start ; */
    	background:orchid;
	}
	.b {
		/* grid-column: col3-start ;
		grid-row: row1-start; */
    	background:orange;
	}
	.c {
		/* grid-column: col1-start;
		grid-row: row2-start ; */
   		background:blue;
	}
	.d {
		/* grid-column: col2-start / col3-end ;
		grid-row: row2-start ; */
   		background:lightcoral;
	} 
	.box {
		border-radius: 5px;
		padding: 10px;
		font-size: 24px;
	} 

</style>