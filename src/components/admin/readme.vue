<template>
  <div class="readme">
    <mavon-editor v-model="value" :ishljs = "true" :default_open="preview" />
  </div>
</template>

<script>
export default {
  name:"readme",
  data(){
      return {
          value: "",
          preview: 'preview'
      }
  }
}
</script>

<style scoped>
    .readme{
        height: 100%;
    }
</style>

