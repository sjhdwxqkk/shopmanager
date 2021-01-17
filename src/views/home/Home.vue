<template>
  <div class="home">
    <Login></Login>
  </div>
</template>

<script>
  import Login from "@/components/common/Login";
  export default {
    name: "home",
    components: {
      Login
    }
  }
</script>

<style scoped>
 .home {
   background-color: #2b4b6b;
   height: 100%;
 }
</style>