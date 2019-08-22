<template>
  <div class="continer">
    <div class="row mt-5 justify-content-md-center">
      <div class="col-md-4 ">
        <transition name="fade" >
          <div class="progress">
          <div v-if="loading" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
        </div>
        </transition>
         <div class="d-flex p-3 bg-white border align-items-center justify-content-center" >
            <form class="w-100 px-4" @submit.prevent="register" >
                <input v-model="name" type="text"  minlength="3" name="name" id="name"  class="form-control"  placeholder="Name" required >
                <input v-model="email" type="email" name="email" id="email" class="form-control mt-2"  placeholder="Email" required>
                <input v-model="phone" type="tel" minlength="10" maxlength="10" name="phone" id="phone" class="form-control mt-2"  placeholder="Phone" required>
                <input v-model="password" type="password" name="password" autocomplete  id="password" class="form-control mt-2" minlength="6"  placeholder="Password" required>
                <button :disabled="loading" class="btn mt-2 btn-primary btn-block" >Submit</button>
            </form>  
    </div>
         <transition name="fade">
            <div  v-if="showMsaage" class="alert mt-1 alert-danger" role="alert">
              {{message}}
          </div>
          </transition>
      </div>
    </div>
  </div>
</template>

<script>

import {auth,usersCollection, currentUser, walletCollection} from "../firebase";

export default {
  name:'register',
  data(){
    return{
      name:'',
      email:'',
      phone:'',
      admin:false,
      password:'',
      balance: 100,
      winBalance: 0,
      loading:false,
      showMsaage: false,
      message:''
    }
  },
  methods:{
    register(){
           this.loading = true
           auth.createUserWithEmailAndPassword(this.email, this.password).then(data => {
              
              // create user obj
              usersCollection.doc(data.user.uid).set({
                  name: this.name,
                  email: this.email,
                  phone: this.phone,
                  admin: this.admin,
                  winBalance: this.winBalance,
                  timestamp: new Date(),
                  walletBalance: this.balance
              }).then(() => {

                  walletCollection.doc(data.user.uid).set({
                    balance:this.balance,
                    userName: this.name,
                    timestamp: new Date(),
                    lastUpdate: new Date(),
                    uid: data.user.uid,
                    
                  }).then(()=>{
                      this.loading = false
                      this.$router.push(`/login?ref=register&msg=You account created successfully please login&email=${this.email} `)
                      this.$router.push({ path: 'login', query: { 
                        ref: 'register', 
                        msg:'You account created successfully please login' ,
                        email:this.email 
                        } })
                

                  }).catch((err)=>{
                      alert(err);
                                          
                  })

              
              }).catch(err => {
                 
              
              })
          }).catch(err => {
                 this.message = err.message
                    this.showMsaage = true;
                    setTimeout(() => {
                       this.showMsaage = false; 
                    }, 5000);

                    this.loading = false;
          })
    }
  }
}
</script>
