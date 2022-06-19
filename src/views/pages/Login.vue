<template>
  <div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<div class="login100-pic js-tilt" data-tilt>
					<!-- <img src="images/logo.png" alt="IMG"> -->
				</div>

				<form class="login100-form validate-form">
					<span class="login100-form-title">
					Login
					</span>

					<div class="wrap-input100 validate-input">
						<input class="input100" type="text" name="Username" placeholder="Username" v-model="form.username">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-envelope" aria-hidden="true"></i>
						</span>
					</div>

					<div class="wrap-input100 validate-input" data-validate = "Password is required">
						<input class="input100" type="password" name="pass" placeholder="Password" v-model="form.password">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<i class="fa fa-lock" aria-hidden="true"></i>
						</span>
					</div>
					
					<div class="container-login100-form-btn">
						<button class="login100-form-btn" type="button" @click="doLogin()">
							Login
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { Md5 } from "ts-md5/dist/md5";
import { findUserByUsernamePassword } from "../../db/action/user";
import { createToast } from "mosha-vue-toastify";
// import the styling for the toast
import "mosha-vue-toastify/dist/style.css";

export default defineComponent({
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapMutations("app", ["setLoggineduser"]),
    async doLogin() {
			if (this.form.username.trim() === "" || this.form.password.trim() === "") {
				createToast("Username / Password tidak boleh kosong", {
          hideProgressBar: true,
          type: "danger",
        });

				return
			}

      const user = await findUserByUsernamePassword(
        this.form.username,
        Md5.hashStr(this.form.password) // lakukan hashing
      );
      if (user) {
        this.setLoggineduser(user);
        createToast("Berhasil Login", {
          hideProgressBar: true,
          type: "success",
        });
      } else {
				createToast("Gagal Login, Username / Password salah", {
          hideProgressBar: true,
          type: "danger",
        });
      }
    },
  },
});
</script>

<style scoped>
@import "../../assets/Login_v1/vendor/bootstrap/css/bootstrap.min.css";
@import "../../assets/Login_v1/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
@import "../../assets/Login_v1/vendor/animate/animate.css";
@import "../../assets/Login_v1/vendor/css-hamburgers/hamburgers.min.css";
@import "../../assets/Login_v1/vendor/select2/select2.min.css";
@import "../../assets/Login_v1/css/util.css";
@import "../../assets/Login_v1/css/main.css";
</style>