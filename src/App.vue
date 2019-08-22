<template>
 <div id="app" >
   <!-- Image and text -->
  <router-view/>
   <div v-if="this.$route.name === 'home' || this.$route.name ===  'userhome'" class="container">
    
     <div class="row   bg-warning py-3" >
        <div class="col-md-2" >
          <router-link  class="btn btn-block   btn-light btn-outline-danger " to="/main-result">RSULT</router-link>
        </div>
        <div class="col-md-2" >
         <router-link v-if="currentUser  === 'null' || currentUser  === null ? true : false" class="btn btn-block btn-light btn-outline-danger" to="/login">Login</router-link>
        </div>
        <div class="col-md-3" >
         <router-link v-if="currentUser  === 'null' || currentUser  === null ? true : false"  class="btn btn-block  btn-light btn-outline-danger" to="/register">Creaet an account</router-link>
        </div>
        <div class="col-md-2" >
            <button v-if="currentUser  === 'null' || currentUser  === null ? false : true"  class="btn b btn-light btn-outline-danger" @click="logout" >Logout </button>
        </div>
        <div class="ml-auto" ></div>
        <div class="col-md-3 text-right" >
          <button  @click="refresh" class="btn btn-outline-danger mr-2 btn-light" >Reresh</button>
         <!-- <router-link  class="btn btn-outline-danger btn-light" to="/">Go to HOME</router-link> -->
        </div>
     </div>

    <div class="bg-warning row text-center border-top pt-3 text-dark" >
      <p  class="small">
        Purchase of lottery using this website is strictly prohibited in the states where lotteries are banned. You must be above 18 years to play Online Lottery. 
        playindialottery.com all rights reserved.
      </p>
    </div>

   </div>
  
  <div v-if="this.$store.state.loading" class="wrapper" >
           <div class="lds-dual-ring"></div>
  </div>

  </div>
</template>

<script>
    
    import { auth, providerCollection} from "./firebase";

    export default {
      computed:{
        currentUser(){
          return this.$store.getters.getUserData
        }
      
      },

      created(){
        this.$store.commit('showLoading')
        
          let user =  JSON.parse(window.localStorage.getItem('auth'));
          this.$store.commit('setCurrentUser', user)
          this.$store.dispatch('fetchProvider')
          this.$store.dispatch('fetchTimeSetting').then(()=>{

                this.$store.dispatch('generateTimeSlots').then(()=>{
                        this.$store.dispatch('calulateNextDrawTime');
                        let cs = new Date().getSeconds();
                        let ds = this.$store.getters.getDivision * 60;
                        let nextCall = ds - cs;
                        
                        setInterval(() => {
                        this.$store.dispatch('calulateNextDrawTime')
                            nextCall =  ds;
                            this.$store.dispatch("fetchCurrentResult")
                      }, nextCall * 1000);
                        
              });


               this.$store.commit('hideLoading')

              setTimeout(() => {
                 this.$store.dispatch("fetchCurrentResult")

              }, 1000);
              
          });

       
      },

        methods: {
            logout() {
                auth.signOut().then(() => {
                    this.$store.dispatch('signOut')
                    this.$router.push('/')
                }).catch(err => {
                    console.log(err)
                })
            },
              refresh() {
                    window.location.reload()
            }
        }
    }
</script>

<style>
  body{
 
  }
  #app {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom:0;
      overflow-y: auto;
          background-color: #082ce5;
     
  }

  .container{
    max-width: 1050px !important;
  }
  

  .fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>


