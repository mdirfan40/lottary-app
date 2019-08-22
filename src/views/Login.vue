<template>
  <div class="continer">
    <div class="row mt-5 justify-content-md-center">
      <div class="col-md-4 ">
        <div v-if="alert"  class="alert alert-success" >
              {{message}}
        </div>
         <div class="d-flex p-3 bg-white border align-items-center justify-content-center" >
      <form class="w-100 px-4" @submit.prevent="login" >
        <input v-model="email" type="email" name="email" id="email" class="form-control"  placeholder="Email" required >
        <input v-model="password" type="password" name="password" id="password" class="form-control mt-2" minlength="6"  placeholder="Password" required>
        <button class="btn mt-2 btn-primary btn-block" >Submit</button>
      </form>  
    </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, usersCollection } from "../firebase";

export default {
  name:'logind',
  data(){
    return{
        message:'',
        alert:false,
        email:'',
        password:''
    }
  },
  mounted(){
    if('ref' in this.$route.query){
        if (this.$route.query.ref === 'register') {
              this.alert = true;

              if ('email' in this.$route.query) {
                  this.email  = this.$route.query.email
              }

              if ('msg' in this.$route.query) {
                   this.message = this.$route.query.msg
              }else{
                this.message = 'You account created successfully please login'
              }
        }
    }
    
  },

  methods:{
    login(){

      if(!this.email || !this.password){
          alert('Please enter email and password')
          return;
      }
     
      this.$store.commit('showLoading')

      auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
              usersCollection.doc(user.user.uid).get().then(res =>{
                  let userData = res.data();
                  userData['uid'] = user.user.uid;
                  
                  this.$store.commit('setCurrentUser', userData)
                   if(this.$store.getters.getUserData){
                      if(this.$store.getters.getUserData.admin){
                            this.$router.push(`/dashboard`)
                      }else{
                        this.$router.push(`/user/${user.user.uid}`)
                      }
                  }else{
                    this.$router.push('/login')
                  }
                  this.$store.commit('hideLoading')

              }).catch(err =>{
                  console.log(err);
              })
        
      }).catch(err => {
          alert(err.message)
          this.$store.commit('hideLoading')
      })

    }
  }
}
</script>
