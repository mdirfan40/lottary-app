<template>
  <div class="container mt-5 " >
    <div class="btn-group" role="group" aria-label="Tabs">
    <router-link v-bind:class="{ 'btn-warning': this.$route.name === 'userhome', 'btn-light': this.$route.name !== 'userhome' }" class="btn " :to="`/user/${this.$route.params.id}/`" > Place a Order </router-link>
    <router-link class="btn " v-bind:class="{ 'btn-warning': this.$route.name === 'order', 'btn-light': this.$route.name !== 'order' }" :to="`/user/${this.$route.params.id}/order`" > Orders </router-link>
    </div>
 
    <router-view/>
  
  </div>
</template>
