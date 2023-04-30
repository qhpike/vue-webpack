<!--
 * @Author: akexian
 * @Date: 2023-03-30
 * @Description: 
-->
<template>
  <div class="container">
    <el-form ref="form" inline>
      <h5>订单管理</h5>
      <el-form-item label="下单日期：">
        <date-range
          v-model="query.createTime"
          @change="querySearch"
        ></date-range>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.orderId"
          style="width: 210px !important"
          prefix-icon="el-icon-search"
          placeholder="订单号"
          @change="querySearch"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="query.nickName"
          prefix-icon="el-icon-search"
          placeholder="用户名"
          @change="querySearch"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="query.invoiceStatus"
          @change="querySearch"
          placeholder="请选择支付状态"
          clearable
        >
          <el-option label="已付款" :value="1" />
          <el-option label="未付款" :value="0" />
        </el-select>
      </el-form-item>
      <div>
        <el-form-item>
          <el-radio-group v-model="query.status" @change="querySearch">
            <el-radio-button :label="99">全部</el-radio-button>
            <el-radio-button :label="0">待付款</el-radio-button>
            <el-radio-button :label="1">待发货</el-radio-button>
            <el-radio-button :label="2">待收货</el-radio-button>
            <el-radio-button :label="3">已完成</el-radio-button>
            <el-radio-button :label="4">已取消</el-radio-button>
            <el-radio-button :label="5">已关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
    </el-form>
    <div class="box-show">
      <el-table
        :data="list"
        fit
        :height="tableHeight"
        tooltip-effect="light"
        v-loading="loading"
      >
        <el-table-column prop="orderId" label="订单号"> </el-table-column>
        <el-table-column prop="userObj.nickName" label="用户">
        </el-table-column>
        <el-table-column prop="receivAble" label="订单金额"> </el-table-column>
        <el-table-column label="商品明细">
          <template v-slot="{ row }">
            <div v-if="row.skuText">
              <el-popover
                placement="bottom"
                trigger="hover"
                :open-delay="500"
                class="item-p-container"
              >
                <div style="width: 270px">
                  <el-table :data="row.skuArr" size="mini" class="table-border">
                    <el-table-column
                      label="商品"
                      prop="productSpuName"
                      show-overflow-tooltip
                    />
                    <el-table-column label="规格" prop="productSkuName" />
                    <el-table-column label="数量" prop="count" />
                  </el-table>
                </div>
                <div slot="reference" style="curosr: pointer" class="ellipsis">
                  {{ row.skuText || "-" }}
                </div>
              </el-popover>
            </div>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="actualAmount" label="实收"> </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="invoiceStatus" label="支付状态" align="center">
          <template v-slot="{ row }">
            <div
              :class="row.invoiceStatus === 0 ? 'error-text' : 'success-text'"
            >
              {{ row.invoiceStatus === 0 ? "待支付" : "已支付" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template v-slot="{ row }">
            <span>{{ getStatus(row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间">
          <template v-slot="{ row }">
            <span>{{ row.createTime | dateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.status === 1"
              type="text"
              @click="handleSend(row)"
              >发货</el-button
            >
            <el-button type="text" @click="handleDetail(row)"
              >订单详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container">
        <div>
          <span
            style="margin-left: 10px"
            v-for="item in totalList"
            :key="item.status"
          >
            {{ getStatus(+item.status) }}：<label
              class="price-text font-size-12"
              >{{ item.total }}</label
            >
          </span>
        </div>
        <Pagination
          :page="params.page"
          :pageSize="params.pageSize"
          :total="total"
          @change="pageChange"
        />
      </div>
    </div>
    <Detail :id="id" :visible.sync="visible" />
  </div>
</template>

<script>
import { parseTime, deepClone, getTableHeight } from "@/utils/index";
const status = new Map()
  .set(0, "待付款")
  .set(1, "待发货")
  .set(2, "待收货")
  .set(3, "订单完成")
  .set(4, "订单取消")
  .set(5, "订单关闭");
export default {
  components: {
    Detail: () => import("./Detail.vue"),
  },
  mounted() {
    this.getData();

    this.$nextTick(() => {
      this.tableHeight = getTableHeight(this.$refs.form) - 52 - 20 - 40;
    });
  },
  data() {
    return {
      loading: false,
      list: [],
      params: {
        page: 1,
        pageSize: 20,
      },
      custQuery: "", //模糊查询
      query: {
        createTime: "",
        orderId: "",
        nickName: "",
        invoiceStatus: "",
        status: 99,
      },

      total: 0,
      tableHeight: undefined,
      id: 0, //用于详情
      visible: false, //用于详情
      totalList: [],
    };
  },

  methods: {
    async getData() {
      this.loading = true;
      const params = this.getParams();
      const { code, data } = await this.$service.order.list(params);
      if (code !== 200) return;
      (data.result || []).forEach((item) => {
        //商品明细描述文字
        item.skuText = item.skuArr
          .map((child) => {
            return child.productSpuName + "/" + child.productSkuName;
          })
          .join(",");
      });
      this.list = data.result;
      this.total = data.total;
      this.totalList = data.sumData;
      this.loading = false;
    },
    getStatus(val) {
      return status.get(val);
    },
    /**查询(分页) */
    pageChange(val) {
      this.params = val;
      this.getData();
    },
    /**查询（分页除外） */
    querySearch() {
      this.params.page = 1;
      this.getData();
    },
    /**查询参数处理 */
    getParams() {
      const query = JSON.parse(JSON.stringify(this.query));
      for (const key in query) {
        if (Object.hasOwnProperty.call(query, key)) {
          if (!query[key] && query[key] !== 0) {
            delete query[key];
          }
          if (query.status === 99) {
            delete query.status;
          }
        }
      }
      return {
        params: this.params,
        query: query,
      };
    },
    /**发货操作 */
    async handleSend({ id }) {
      try {
        await this.$confirm("是否确认已发货", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        });
        const data = {
          type: "send",
        };
        const { code } = await this.$service.order.update(id, data);
        if (code !== 200) this.$message.error("操作失败");
        this.$message.success("操作成功");
        this.querySearch();
      } catch (error) {}
    },
    /**订单详情 */
    handleDetail({ id }) {
      this.id = id;
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 1px 13px 1px rgba(62, 72, 160, 0.1);
  border-radius: 20px 20px 20px 20px;
  opacity: 0.1;
}
.page-container {
  display: flex;
  div:first-of-type {
    color: #333333;
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding-bottom: 15px;
  }
  div:last-of-type {
    width: 30%;
  }
}
</style>