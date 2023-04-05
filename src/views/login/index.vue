<template>
  <div :class="styles['container']">
    <div :class="styles['content']">
      <div :class="styles['drop']">
        <div :class="styles['contentBox']">
          <h2>Sign in</h2>
          <form @submit.prevent="login">
            <div :class="styles['inputBox']">
              <input
                type="text"
                placeholder="Username"
                v-model="username"
                autocomplete="off"
              />
            </div>
            <div :class="styles['inputBox']">
              <input
                type="password"
                placeholder="Password"
                autocomplete="off"
                v-model="password"
              />
            </div>
            <div :class="styles['inputBox']">
              <input type="submit" value="Login" autocomplete="off" />
            </div>
          </form>
        </div>
      </div>
      <div :class="styles['btns']">
        <span>Forget</span>
        <span>Password</span>
      </div>
      <div :class="`${styles.btns} ${styles.signup}`">Signup</div>
    </div>
  </div>
</template>

<script>
import styles from "./index.module.scss";
export default {
  data() {
    return {
      styles,
      username: "",
      password: "",
      redirect: undefined,
      input1: false,
      input2: false,
    };
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  mounted() {
    console.log(styles, "styles");
  },

  methods: {
    async login() {
      this.$store
        .dispatch("user/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.code === 200) {
            this.$message.success("登录成功");
            this.$router.push({ path: this.redirect || "/" });
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    },
  },
};
</script>

