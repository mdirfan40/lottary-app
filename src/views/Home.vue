<template>
  <div style="background: #8eab0c;" class="container mt-3 ">

    <div>
      <img :src="image" class="w-100" >
    </div>

    <div class="mt-1">
      <marquee><h1 style="text-shadow: 0 0 5px #ff00" class="text-white h2 " >PLAY ONLINE LOTTERY ON INDIA LOTTERY</h1></marquee>
    </div>
    <!-- <div class="row bg-white  mb-3">
      <div class="col">
        <h5 class="border-bottom py-2 mb-3" >Current Result, {{currentResult.date}},  {{currentResult.timeSlot}}</h5>
          <div class="row mb-3 ">
            <div v-for="(result, i) in currentResult.result" :key="i+'_cresult'" class="col-md-1 pr-1">
                <div class="p-2 border  text-center  w-100">
                  <p class="h5" >{{result.name}}</p>
                  <p class="h4 text-danger " >{{result.digitOne}}{{result.digitTwo}}</p>
                </div>
            </div>
        </div>
      </div>
    </div> -->

      <div style=" color: Yellow;" class=" border-top row" >
      
        <div class="col-md-12 ">
          <div class="d-flex" >
               <div class="time-section py-md-4 p-2 " >
                <div class="h5"> Today Date </div>
                  <span class="h4" >{{ todayDate }}</span>
            </div>
            <div class="time-section py-md-4 p-2  border-left" >
                <div class="h5 "> Current Time </div>
                  <span class="h4 " >{{ currentTime }}</span>
            </div>
              <div class="time-section ml-auto border-left  py-md-4 p-2  " >
                <div class="h5"> Next Draw Time </div>
                  <span class="h4 " >{{ nextDarwTime.next}}</span>
            </div>
          </div>
        </div>
    
       
          <!-- <div class="col-md-2">
          <div class="time-section py-4  " >
              <div class="h5 "> Time to draw </div>
                <span class="h4 " > {{nextDarwTime}}</span>
          </div>
        </div> -->
      </div>

      <div class="row  " >
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
    

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import image from "../assets/india1.png";

export default {
  name: 'home',
  data(){
    return {
      orders:[],
      image:image,
      currentTime: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric' , hour12: true })
    }
  },
  
  created(){
    this.interval = setInterval(() => {
          this.updateTime();
      }, 1000);  

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
    },

    getDivision(){
      return this.$store.getters.getDivision;
    }

  },


  methods:{
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
