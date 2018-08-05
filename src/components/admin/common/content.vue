<template>
    <div class="content">
       <button @click="test()">测试</button>
    </div>
</template>

<<script>
export default {
  name:'mj_content',
  data(){
      return {}
  },
  props:{

  },
  methods:{
      test:function () {
          this.getRequest("/admin/menu/list").then(response => {
                console.log(response)
          }).catch(e => {
            console.log(e)
          })
      }
  }
}
</script>
<<style scoped>
    .content img{
       
    }
</style>

