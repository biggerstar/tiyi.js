<template>
  <div>
    <h1>{{ msg }}</h1>

    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>


    <!--    <iframe src="https://localhost:11000/aa/page1" style="background: white"></iframe>-->
    <!--    <p>-&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;</p>-->
    <a href="https://localhost:10000/aa/page1#test3">不变</a>
    <div id="ti-app"></div>
    <div id="ti-app1"></div>
    <div id="ti-app2"></div>
    <div id="ti-app3"></div>


  </div>
</template>
<script setup>

defineProps({
  msg: String,
})


</script>

<style scoped>
#ti-app,#ti-app1{
  width: 40%;
  display: inline-block;
}
.read-the-docs {
  color: #888;
}
</style>
