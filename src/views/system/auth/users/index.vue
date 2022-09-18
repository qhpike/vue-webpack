<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-tree
            :data="areaTree.data"
            :props="areaTree.defaultProps"
            node-key="id"
            :default-expanded-keys="[1]"
            :default-checked-keys="[1]"
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content">
          <el-button
            v-permission="$service.user.permission.add"
            size="small"
            type="primary"
            @click="handleAddUser"
            >新增用户</el-button
          >

          <!-- <el-table
            :data="tableData"
            border
            fit
            highlight-current-row
            :header-cell-style="headClass"
            style="width: 100%;margin-top:30px;"
          >
            <el-table-column align="center" prop="username" label="用户名" />
            <el-table-column align="center" prop="name" label="姓名" />
            <el-table-column align="center" prop="nick_name" label="真实姓名" />
            <el-table-column align="center" prop="name" label="角色名" />
            <el-table-column align="center" prop="phone" label="电话" />
            <el-table-column align="center" prop="remark" label="描述" />
            <el-table-column align="center" prop="areaname" label="机构" />
            <el-table-column align="center" prop="create_time" :formatter="dateFormat" label="创建时间" />

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleEdit(scope)"
                >编辑</el-button>
                <el-button
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
          <el-table
            :data="tableData"
            style="width: 100%; margin-top: 30px"
            border
            fit
            align="center"
            :header-cell-style="headClass"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="编号">
                    <span>{{ props.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="用户名">
                    <span>{{ props.row.username }}</span>
                  </el-form-item>
                  <el-form-item label="姓名">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="真名">
                    <span>{{ props.row.nick_name }}</span>
                  </el-form-item>
                  <el-form-item label="电话">
                    <span>{{ props.row.phone }}</span>
                  </el-form-item>
                  <el-form-item label="备注">
                    <span>{{ props.row.remark }}</span>
                  </el-form-item>
                  <el-form-item label="最后登录IP">
                    <span>{{ props.row.last_ip }}</span>
                  </el-form-item>
                  <el-form-item label="最后登录时间">
                    <span v-if="props.row.last_login">{{
                      props.row.last_login | userTime
                    }}</span>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span>{{ props.row.create_time | userTime }}</span>
                  </el-form-item>
                  <el-form-item label="更新时间">
                    <span>{{ props.row.update_time | userTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="用户名"
              prop="username"
              width="180"
              align="center"
            />
            <el-table-column
              label="电话"
              prop="phone"
              width="180"
              align="center"
            />
            <el-table-column
              label="机构"
              prop="areaname"
              width="180"
              align="center"
            />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  @click="handleEdit(scope)"
                  >编辑</el-button
                >
                <el-button
                  v-permission="$service.user.permission.delete"
                  size="small"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogType === 'edit' ? '用户编辑' : '新增用户'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="dialogVisible"
        ref="userForm"
        :model="user"
        :rules="userRules"
        status-icon
        size="medium"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="机构" prop="area_id">
          <el-cascader
            ref="areaTree"
            v-model="user.area_id"
            :disabled="dialogType !== 'new'"
            :options="newArea.data"
            :props="newArea.defaultProps"
            clearable
            :show-all-levels="false"
            placeholder="请选择机构"
            @change="toggleDropDown"
          />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input
            v-model.trim="user.username"
            placeholder="请输入账号"
            clearable
            :disabled="dialogType !== 'new'"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="user.password"
            type="password"
            clearable
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="密码" prop="checkPass">
          <el-input
            v-model.trim="user.checkPass"
            type="password"
            clearable
            placeholder="请再次输入密码"
          />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input
            ref="phone"
            v-model.trim="user.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roleList">
          <el-cascader
            v-model="user.roleList"
            :options="allRole.data"
            :props="allRole.defaultProps"
            clearable
            :show-all-levels="false"
            placeholder="请选择角色"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model.trim="user.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model.trim="user.nick_name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="user.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('userForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime, deepClone } from "@/utils/index";
import { validPhone } from "@/utils/validate";
import { mapGetters } from "vuex";
const defaultUser = {
  id: null,
  area_id: null,
  username: "",
  password: "",
  checkPass: "",
  name: "",
  phone: "",
  nick_name: "",
  avatar:
    "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3866513739,3961195204&fm=26&gp=0.jpg",
  remark: "",
  roleList: [],
};
export default {
  data() {
    const validateUsername = async (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入6位以上用户名"));
      } else {
        const result = await this.$service.user.vlidateUser(value);
        if (result.code === 200) {
          callback();
        } else {
          callback(new Error("用户名已占用"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.user.checkPass !== "") {
          this.$refs.userForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (validPhone(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不正确"));
      }
    };
    return {
      areaTree: {
        data: [],
        defaultProps: {
          children: "children",
          label: "name",
        },
      },
      newArea: {
        data: [],
        defaultProps: {
          value: "id",
          children: "children",
          label: "name",
          emitPath: false,
          checkStrictly: true,
        },
      },
      allRole: {
        data: [],
        defaultProps: {
          value: "id",
          label: "name",
          emitPath: false,
          checkStrictly: true,
          multiple: true,
        },
      },
      tableData: [],
      dialogVisible: false,
      dialogType: "new",
      formLabelWidth: "120px",
      checkStrictly: false,
      user: Object.assign({}, defaultUser),
      userRules: {
        area_id: [
          {
            required: true,
            message: "请选择所属区域",
            trigger: "change",
            type: "number",
          },
        ],
        username: [
          { required: true, validator: validateUsername, trigger: "blur" },
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
        checkPass: [
          { required: true, trigger: "blur", validator: validatePass2 },
        ],
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        roleList: [
          { required: true, message: "请选择角色", trigger: "change" },
        ],
      },
    };
  },

  computed: {
    ...mapGetters(["areaid"]),
  },
  watch: {
    "user.area_id": function (newss, old) {
      // 选择区域变化，就获取对应角色数组
      this.getarearoles(newss);
      console.log(newss, old, "xxx");
    },
    deep: false,
  },

  // 此处roles为当前用户的routes
  mounted() {
    this.getareatree();
    // 是否mounted当前用户区域用户列表
    // this.getareausers(this.areaid)
  },
  methods: {
    handleNodeClick(data) {
      // 点击树
      this.getareausers(data.id);
    },
    async getareatree() {
      // 获取区域树型数据
      const { data } = await this.$service.area.list();
      this.areaTree.data = data;
      this.newArea.data = data;
    },
    async getareausers(id) {
      // 获取各区域的用户数据
      const areaUsers = await this.$service.user.list(id);
      this.tableData = areaUsers.data;
    },
    async getarearoles(id) {
      // 获取各区域的角色数据下拉选择
      const isNew = this.dialogType === "new";
      // 如果是新增页面，区域变动，则清空已选roleList列表
      if (isNew) {
        this.user.roleList.length = 0;
      }
      if (id) {
        const arearoles = await this.$service.role.list(id);

        // this.user.roleList.length = 0
        this.allRole.data = arearoles.data;
      } else {
        this.allRole.data = [];
      }
    },
    // 时间格式化
    dateFormat(row, column) {
      const oldtime = row[column.property];
      return parseTime(new Date(oldtime));
    },
    handleAddUser() {
      // 新增用户
      // 考虑是否每次进入编辑清空页面
      // this.user = Object.assign({}, defaultUser)
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    async delUser(data, index) {
      // 删除角色
      const result = await this.$service.user.delete(data);
      if (result.code === 200) {
        this.$message({ message: "用户已删除", type: "success" });
        // this.getareausers(area_id)
        // 更新用户列表
        this.tableData.splice(index, 1);
      } else {
        this.$message.error("删除失败");
      }
    },
    async handleDelete(scope) {
      // 调出删除角色确认弹框
      try {
        await this.$confirm("此操作将永久删除用户，是否确认继续", "请确认", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const data = { id: scope.row.id };
        this.delUser(data, scope.$index);
        // 调用删除角色
      } catch (error) {
        console.log(error);
      }
    },
    handleEdit(scope) {
      // 编辑用户
      this.dialogType = "edit";
      // this.checkStrictly = true
      this.dialogVisible = true; // 防止显示菜单节点时候联动父节点
      const rowval = deepClone(scope.row);
      rowval.roleList = rowval.roleList.map((r) => {
        return r.role_id;
      });
      this.user = rowval;
    },
    async confirmUser() {
      // 弹出框，用户保存按钮,修改或者新增
      const isEdit = this.dialogType === "edit";
      if (this.user.password) {
        // 密码MD5加密处理
        this.user.password = this.$md5(
          this.$md5(this.user.password).split("").reverse().join("")
        );
      }
      if (isEdit) {
        const result = await this.$service.user.update(this.user);
        if (result.data.success) {
          this.$message({
            message: "用户修改成功",
            type: "success",
          });
          const idx = this.user.area_id;
          this.user = Object.assign({}, defaultUser);
          this.dialogVisible = false;
          this.getareausers(idx);
        } else {
          this.$message.error("用户修改失败");
          return;
        }
        this.dialogVisible = false;
        // this.user = Object.assign({}, defaultUser)
        // 是否刷新用户列表
        // this.getareausers(this.role.area_id)
      } else {
        const { data } = await this.$service.user.add(this.user);
        if (data.success) {
          this.$message({
            message: "用户创建成功",
            type: "success",
          });
          const idx = this.user.area_id;
          this.user = Object.assign({}, defaultUser);
          this.dialogVisible = false;
          this.getareausers(idx);
        } else {
          this.$message.error("用户创建失败");
          return;
        }

        // 是否刷新用户列表
        // this.getareausers(this.role.area_id)
      }
    },
    async submitForm(formName) {
      const isNew = this.dialogType === "new";
      if (isNew) {
        // 表单完全校验
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.confirmUser();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        // 只校验手机号和角色列表
        this.$refs[formName].validateField("phone", (valid) => {
          if (valid) {
            return false;
          } else {
            this.$refs[formName].validateField("roleList", (valid2) => {
              if (valid2) {
                return false;
              } else {
                this.confirmUser();
              }
            });
          }
        });
      }
    },
    toggleDropDown() {
      this.$refs.areaTree.toggleDropDownVisible();
    },
    headClass() {
      return "text-align: center;background:#eef1f6;";
    },
  },
};
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.permission-tree {
  margin-bottom: 30px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
