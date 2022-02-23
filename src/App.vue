<template>
  <div id="nav">
    <div v-if="auth.currentUser">
      <router-link to="/">Home</router-link> | 
      <router-link to="/about">About</router-link> | 
      <router-link to="/articles">Articles</router-link> | 
      <button @click="$store.dispatch('logout')">Logout</button>
    </div>
    <div v-else>
      <router-link v-if="$route.name == 'Login'" to="/register">Register</router-link>
      <router-link v-if="$route.name == 'Register'" to="/login">Login</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
import { auth } from "./firebase";

export default {
  data () {
    return {
      auth: auth
    }
  },
  setup() {
    const store = useStore();

    onBeforeMount(() => {
      store.dispatch("fetchUser");
    });
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
