<template>
  <div class="container mt-3  border ">
    
    <div class="row bg-white  mb-3">
      <div class="col">
          <div class=" py-2" >
              <div>
                 <h5  >Welcome , {{userData.name}}</h5>
                <div>
                      <span  class=" text-danger  h4 " >Balance: {{userData.walletBalance}},</span>  
                      <div  class=" text-danger   h4 " > Win Balance: {{userData.winBalance}}</div>  
                </div>
              </div>
          </div>
      </div>
    </div>
 

      <div class="row bg-white ">
        <div class="col-md-2 border-right">
          <div class="time-section    py-4  " >
              <div class="h5"> Today Date </div>
                <span class="h4" >{{ todayDate }}</span>
          </div>
        </div>
        <div class="col-md-2 ">
          <div class="time-section py-4  " >
              <div class="h5 "> Current Time </div>
                <span class="h4 " >{{ currentTime }}</span>
          </div>
        </div>
          <div class="col-md-2 border-left ml-auto">
          <div class="time-section  py-4 " >
              <div class="h5"> Next Draw Time </div>
                <span class="h4 " >{{ nextDarwTime.next}}</span>
          </div>
        </div>
          <!-- <div class="col-md-2">
          <div class="time-section py-4  " >
              <div class="h5 "> Time to draw </div>
                <span class="h4 " > {{nextDarwTime}}</span>
          </div>
        </div> -->
      </div>

      <div class="row bg-white " >
        <div class="col-md-12">
          <div class="overflow-auto">
              <table class="table">
                <thead class="">
                  <tr class="bg-warning">
                    <th  class="text-capitalize text-center" v-for="(thead, i) in tableHead" :key="i" scope="col">{{thead}}</th>
                    <th>{{currentResult.timeSlot}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(data, i) in getTableData" :key="i" scope="row" :style="{backgroundColor: data.color}" >
                    <td width="100" class="text-capitalize" ><span style=" text-shadow: 0px 0px 5px #484848;" class="h4 text-white " >{{data.name}}</span></td>
                    <td class="text-capitalize" ><span style="text-shadow: 0px 0px 5px #484848;" class="text-white h5" >{{data.series}}</span> </td>
                    <td class="text-capitalize" ><span style="text-shadow: 0px 0px 5px #484848;" class="text-white h5" >{{data.winPrice}} </span> </td>
                    <td class=" px-1" v-for="(input, inputIndex) in numbers" :key="inputIndex" > 
                        <input type="text" maxlength="3" 
                        class="w-100 border-0 rounded text-center" 
                        @keydown="validateInput($event)" 
                        @keyup="getInputData(data.name, data.rate,inputIndex, i, $event)" 
                        />
                    </td>
                    <td   class="text-capitalize text-center" >
                        <span class="bg-white w-100  px-2 py-1 rounded" >  {{data.quantity}}</span>
                    </td>

                    <td  class="text-capitalize text-center" >
                        <span class="bg-white  w-100 px-2 py-1 rounded" >  {{data.price}}</span>
                    </td>

                    <td v-for="result in currentResult.result" :key="result.name + '_cr'"   v-if="result.id == data.id"  >
                        <span  class="bg-white p-1 rounded" >{{result.digitOne}}{{result.digitTwo}}</span>
                    </td>
                    
                  </tr>
                  <tr style="background: #fb8302;" class="h4" >
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="text-center" >Total</td>
                    <td class="text-center" >{{grandTotalCount}}</td>
                    <td class="text-center" >{{grandTotalPrice}}</td>
                    <td></td>
                  </tr>
                

                </tbody>
              </table>
          </div>
           
        </div>
      </div>

      <div class="row bg-white">
        <div class="col-md-3 border-right text-right ml-auto" >
          <p  class="mb-0">Draw at current time </p>
          <h3>  {{currentTime}}</h3>
        </div>
         <div class="col-md-3 " >
            <label for="timeSlot" >Or select a different time</label>
             <select id="timeSlot" v-model="timeSlot" class="form-control" name="">
                  <option v-for="slot in getTimeSlotes" :key="slot.value" :disabled="!slot.active"  :value="slot.value"> {{slot.time}}</option>
                </select>
        </div>
        <div class="col-md-2  " >
            <div class="py-2 mt-4">
                <button @click="buyTicket" class="btn btn-block btn-primary" > Buy Now </button>
            </div>
        </div>
       
      </div>


  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { usersCollection, orderCollection } from "../firebase";
export default {
  name: 'home',
  data(){
    return {
      orders:[],
      timeSlot:'',
      currentTime: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' , hour12: true })
    }
  },
  
  created(){
    this.interval = setInterval(() => {
          this.updateTime();
      }, 1000);

    usersCollection.doc(this.$store.getters.getUserData.uid).get().then(res =>{
                  let userData = res.data();
                  userData['uid'] = this.$store.getters.getUserData.uid;
                  this.$store.commit('setCurrentUser', userData)
              }).catch(err =>{
                  console.log(err);
      })
        

  },

  computed:{

    currentResult(){
     return this.$store.getters.getCurrentResult
   },
   
    grandTotalCount(){
        return this.$store.getters.getGrandTotalTicket
    },
    grandTotalPrice(){
        return this.$store.getters.getGrandTotalPrice
    },
    tableHead(){
      return this.$store.getters.getTableHead;
    },

    numbers(){
      return this.$store.getters.getNumbers;

    },

    userData(){
      return this.$store.getters.getUserData;

    },

    todayDate(){
      return this.$store.getters.getTodayDate;

    },

    getTableData(){
       return this.$store.getters.getTableData;
    },

    getTimeSlotes(){
      return this.$store.getters.getTimeSlotes;
    },

    nextDarwTime(){
       return this.$store.getters.getNextDrawTime;
    }

  },


  methods:{
    
    buyTicket(){

        

       if (this.orders.length === 0) {
            alert("Please select the ticket");
            return;
       } 

       
       if (!this.timeSlot ){
          let d = new Date();
          let timeDiffernce = d.getMinutes() > 30 ? 60 - d.getMinutes() : 30 - d.getMinutes();
          if (timeDiffernce <= 2)  {
            alert("You can't draw lottary after two minutes other wise select another time slot");
            return;    
         }

         this.timeSlot = d.getHours() + ':' + d.getMinutes();

       }

      

        if ('id' in this.$route.params) {
            this.$store.commit('showLoading');
            this.orders.forEach((order)=>{
                order['uid'] = this.$route.params.id;
                order['status'] = 'pending';
                order['timestamp'] = new Date();
                order['slot'] = this.timeSlot;
                orderCollection.doc().set(order).then(()=>{
                     
                }).catch(err =>{
                    console.log(err);
                })
           })

            this.$store.dispatch("updateWallet").then(()=>{
              this.$store.commit("hideLoading")
            }).catch(msg =>{
                 this.$store.commit("hideLoading")
                alert(msg)
            })

    

        } 
        
        
    },
    
    updateTime(){
      let time = new Date();
      this.currentTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' , hour12: true })
       
    },
    getInputData(name, rate, ticketNumber, i, e){

      let value = parseInt(e.target.value);
      let price = rate*value;                  

      //  check if input value valid
      if(!this.validateInput(e)) return;

     

      if (value !== '' && value) {
       
            
                // find the input input data in in order of is set or not 
                let foundOrder = this.orders.find((order) => {
                      return order.name === name;
                });

                let orderIndex = this.orders.indexOf(foundOrder)

                if (orderIndex > -1) {


                    // find the input input data in in order of is set or not 
                    let foundTicket = this.orders[orderIndex].tickts.find((ticket) => {
                          return ticket.number === ticketNumber;
                    });
                    
                    // find the index of ticket
                    let ticketIndex = this.orders[orderIndex].tickts.indexOf(foundTicket)
                    
                    // check input avaiable in order order if avaiable the update thet value
                    if(ticketIndex > -1){
                        this.orders[orderIndex].quantity -= foundTicket.quantity
                        this.orders[orderIndex].totalPrice -= foundTicket.price


                        this.$store.dispatch('setQuantityAndPrice', {
                          index:  i,
                          quantity: this.orders[orderIndex].quantity,
                          price: this.orders[orderIndex].totalPrice,
                        })
                        
                        this.orders[orderIndex].tickts.splice(ticketIndex, 1);   
                    }

                      this.orders[orderIndex].tickts.push({
                            number: ticketNumber,
                            quantity: value,
                            price: price
                    });

                    this.orders[orderIndex].quantity += value
                    this.orders[orderIndex].totalPrice += price
                    
                    this.$store.dispatch('setQuantityAndPrice', {
                          index:i,
                          quantity: this.orders[orderIndex].quantity,
                          price: this.orders[orderIndex].totalPrice,
                      })

              }else{
                  
                  // If order not avaiable place a new order


                let _order =  this.getOrder(
                    name,
                    value,
                    price,
                    {
                        number:ticketNumber,
                        quantity: value,
                        price: price
                    }
                  )


                  this.orders.push(_order);

                  this.$store.dispatch('setQuantityAndPrice', {
                      index:i,
                      quantity: value,
                      price: price,
                  })
                  
              }
      }else{
        
                // find the input input data in in order of is set or not 
                let foundOrder = this.orders.find(function(order, i) {
                      return order.name === name;
                });

                let orderIndex = this.orders.indexOf(foundOrder)

                if (orderIndex > -1) {

                    // find the input input data in in order of is set or not 
                    let foundTicket = this.orders[orderIndex].tickts.find(function(ticket, i) {
                          return ticket.number === ticketNumber;
                    });
                    
                    // find the index of ticket
                    let ticketIndex = this.orders[orderIndex].tickts.indexOf(foundTicket)
                    
                    // check input avaiable in order order if avaiable the update thet value
                    if(ticketIndex > -1){
                        this.orders[orderIndex].quantity -= foundTicket.quantity
                        this.orders[orderIndex].totalPrice -= foundTicket.price

                          this.$store.dispatch('setQuantityAndPrice', {
                          index:i,
                          quantity: this.orders[orderIndex].quantity,
                          price: this.orders[orderIndex].totalPrice,
                      })

                        this.orders[orderIndex].tickts.splice(ticketIndex, 1);   
                    }


                  if(this.orders[orderIndex].tickts.length === 0){
                        this.orders.splice(orderIndex, 1);
                  } 

              }

      }

       this.$store.dispatch('grandPriceQuantity')
        
    },

    getOrder(name, quantity, totalPrice, ticket){
       return {
                  name:name,
                  tickts : [ticket],
                  quantity: quantity,
                  totalPrice: totalPrice,
              }
    },

     validateInput(e){
       let inputVlaue =  e.target.value;
         let alphabet = [...'abcdefghijklmnopqrstuvwwxyz;"[{]}.,/\|!@#$%^&*()_=+- '+ "'"] ;
        if(alphabet.indexOf(inputVlaue) > -1){
            e.target.value = '';
            return false;
        }
        return true;
        
    },

  
  }

}
</script>
