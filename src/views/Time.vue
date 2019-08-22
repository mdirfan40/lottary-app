<template>
<div class="container mt-4" >
       <div class="row">
          <div class="col-md-6">
            <form @submit.prevent="save" class="bg-white p-3" >
                  <label for="">Slot</label>
                   <input v-model="defaultTime.slot" class="form-control" type="number"  id="" placeholder="Slot">
                   <label class="mt-3" for="">Start time</label>
                   <input v-model="defaultTime.st" class="form-control" type="text" id="" placeholder=" Ex. 09:00" >
                   <label class="mt-3" for="">End time</label>
                   <input v-model="defaultTime.et"  class="form-control" type="text"  id="" placeholder="Ex. 22:00" >
                   <input class="btn btn-primary mt-3 btn-block" type="submit" value="Submit">
            </form>
          </div>
       </div>
</div>
</template>

<script>
import { timeCollection } from "../firebase";
export default {
       name:'defaultTime',
       data(){
              return{
                     defaultTime:{
                            slot: 15,
                            st:'',
                            et:''
                     }
              }
       },

       mounted(){
              this.fetchList()
       },

       methods:{
              save(){
                     this.$store.commit('showLoading')
                     this.defaultTime.slot = parseInt(this.defaultTime.slot)
                     timeCollection.doc('defaultTime').set(this.defaultTime).then(()=>{
                         this.$store.commit('hideLoading')   
                     }).catch(err=>{
                            alert(err)
                     })
              },
              fetchList(){
                       this.$store.commit('showLoading')
                     timeCollection.get().then(snapshot=>{
                           if(snapshot.docs.length > 0){
                                  
                                   this.defaultTime = snapshot.docs[0].data()
                                    this.$store.commit('hideLoading')  
                           }else{
                                   this.$store.commit('hideLoading') 
                           }
                     })
              }
       }
}
</script>

<style>

</style>

