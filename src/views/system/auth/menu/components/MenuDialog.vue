<template>
  <el-modal
    :visible="visible"
    @close="close"
    :close-on-click-modal="false"
    btn
    width="23%"
    @submit="submit"
    :title="this.menuForm.id ? '编辑' : '新增'"
  >
    <el-form
      ref="menuForm"
      :model="menuForm"
      :rules="getMenuTypeRulues"
      size="small"
      label-width="100px"
      label-position="right"
      :validate-on-rule-change="false"
    >
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="menuForm.type" @change="handleMenuTypeChange">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="节点名称" prop="title">
        <el-input v-model.trim="menuForm.title" placeholder="请输入节点名称" />
      </el-form-item>
      <el-form-item label="上级节点" prop="parentId">
        <el-popover v-model="popdisplay" placement="bottom-start" width="380">
          <el-tree
            ref="pidtree"
            node-key="id"
            :expand-on-click-node="false"
            :data="menuTree.data"
            :props="menuTree.props"
            @node-click="handleMenuNodeClick"
          />
          <el-input
            slot="reference"
            v-model="parentNodeName"
            placeholder="请选择上级节点"
            readonly
          />
        </el-popover>
      </el-form-item>
      <!-- 分面板 -->
      <!-- 菜单面板 -->
      <div v-if="menuForm.type === 1" class="menu-pane">
        <el-form-item label="路由" prop="router">
          <el-input
            v-model.trim="menuForm.router"
            placeholder="请输入节点路由"
          />
        </el-form-item>
        <el-form-item label="命名路由" prop="name">
          <el-input v-model.trim="menuForm.name" placeholder="请输入路由名称" />
        </el-form-item>

        <el-form-item label="节点图标" prop="icon">
          <el-select
            v-model="menuForm.icon"
            placeholder="请选择图标"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in svgIcons"
              :key="item"
              :label="item"
              :value="item"
            >
              <span style="float: left; font-size: 16px; color: #444444">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径" prop="viewPath">
          <el-select
            v-model="menuForm.viewPath"
            placeholder="请选择文件路径"
            style="width: 100%"
          >
            <el-option
              v-for="(item, key) in viewFiles"
              :key="key"
              :label="key + item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="重定向">
          <el-input
            v-model.trim="menuForm.redirect"
            placeholder="请输入重定向"
          />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-switch
            v-model="menuForm.hidden"
            :active-value="0"
            :inactive-value="1"
          />
        </el-form-item>
        <el-form-item label="开启缓存">
          <el-switch
            v-model="menuForm.keepalive"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </div>
      <!-- 权限面板 -->
      <div v-if="menuForm.type === 2" class="perms-pane">
        <el-form-item label="权限" prop="perms">
          <el-cascader
            v-model="menuForm.perms"
            separator=":"
            style="width: 50%"
            :options="perms.options"
            :props="perms.props"
            clearable
          />
        </el-form-item>
      </div>
      <!-- 分面板结束 -->
      <el-form-item label="排序号">
        <el-input
          v-model="menuForm.orderId"
          controls-position="right"
          :min="0"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
  </el-modal>
</template>

<script>
import svgIcons from "@/utils/svg-icons";
import { asyncRoutesMap } from "@/router/index";
import { flatPerms, filterPerms } from "@/utils/permission";
export default {
  name: "MenuDialog",
  props: {
    menuTree: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    id: undefined,
  },
  data() {
    return {
      svgIcons,
      parentNodeName: "根目录",
      menuForm: {
        id: -1,
        parentId: 0,
        perms: "",
        hidden: 0,
        icon: "",
        name: "",
        title: "",
        router: "",
        viewPath: undefined,
        redirect: "",
        type: 1,
        keepalive: 1,
      },
      perms: {
        // 权限
        props: { multiple: false },
        options: [],
      },
      menuFormRules: {
        menu: {
          title: [
            { required: true, message: "请输入节点名称", trigger: "blur" },
          ],
          parentId: [
            { required: true, message: "请选择上级节点", trigger: "change" },
          ],
          router: [
            { required: true, message: "请输入节点路由", trigger: "blur" },
          ],
          name: [
            { required: true, message: "请填写命名路由", trigger: "blur" },
          ],
          icon: [{ required: true, message: "请选择图标", trigger: "blur" }],

          viewPath:[{required: true,message: '请选择组件路径', trigger: 'change'}]
        },
        perm: {
          title: [
            { required: true, message: "请输入节点名称", trigger: "blur" },
          ],
          parentId: [
            { required: true, message: "请选择上级节点", trigger: "change" },
          ],
          perms: [{ required: true, message: "请选择权限", trigger: "change" }],
        },
      },
      popdisplay: true,
    };
  },
  computed: {
    viewFiles: function () {
      return asyncRoutesMap;
    },
    getMenuTypeRulues: function () {
      if (this.menuForm.type === 1) {
        return this.menuFormRules.menu;
      } else {
        return this.menuFormRules.perm;
      }
    },
  },
  watch: {
    visible(val) {
      console.log(this.id,'tis.id')
      val && this.initPerms();
      val && this.id && this.getDetail(this.id);

    },
  },
  methods: {
    handleMenuNodeClick(data) {
      this.menuForm.parentId = data.id;
      this.parentNodeName = data.title;
      this.popdisplay = false;
    },
    handleMenuTypeChange() {
      if (this.$refs.menuForm) {
        this.$refs.menuForm.clearValidate();
      }
    },

    // 初始化权限树形列表数据
    initPerms() {
      const options = [];
      const arr = flatPerms(this.$service);
      flatPerms(this.$service)
        .filter((e) => e.includes(":"))
        .map((e) => e.split(":"))
        .forEach((arr) => {
          filterPerms(0, arr, options);
        });
      this.perms.options = options;
    },
    async getDetail(id) {
      const info = await this.$service.menu.info(id);
      if (info.code === 200) {
        const { menu, parent } = info.data;
        if (menu.type === 2) {
          menu.perms = menu.perms.split(":");
        }
        this.menuForm = { ...menu };
        if (parent) {
          this.parentNodeName = parent.title;
        } else {
          this.parentNodeName = "根目录";
        }
      } else {
        this.$message.error("数据获取失败");
      }
    },
    async submit() {
      await this.$refs.menuForm.validate()
      const postData = { ...this.menuForm };
      if (postData.type === 2) {
        postData.perms = postData.perms.join(":");
      } else {
        delete postData.perms;
      }
      try {
        if (this.id) {
          await this.$service.menu.update({ ...postData });
          this.$message.success("修改成功");
        } else {
          const { code } = await this.$service.menu.create({ ...postData });
          this.$message.success("增加成功");
        }
        this.$emit("success");
        this.close();
      } catch (error) {
        this.$message.error("操作失败");
      }
    },
    close() {
      this.$emit("update:id", undefined);
      Object.assign(this.$data,this.$options.data())
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.select-icon {
  font-size: 16px;
}
</style>
