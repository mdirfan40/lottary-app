<template>
    <div class="p-3 bg-white mt-3 border" >
       <div v-for="(order, i) in orders" :key="i" class="border d-flex p-2 mb-3">
            
            <div class="p-1" >
                <h4 class="h3">{{order.name}} </h4>
                    Quantity: {{order.quantity}} |  Amount: {{order.totalPrice}} 
                <h6 class="mt-3">Tickets</h6>
                <div class=" mt-1" >
                        <div style="height:" class="border mb-2 " v-for="ticket in order.tickts" :key="ticket" >
                            <span> Number :  {{ticket.number}} , Price :  {{ticket.price}}, Quantity: {{ticket.quantity}}</span>
                        </div>
                </div>
            </div>
            <div class="ml-auto p-1" >
                <h5 class="h5" >Time : {{ order.slot | time  }}</h5>
                <h5 class="h5" >Order Placed On : {{ order.timestamp.toDate() | date }}</h5>
                <span class="bg-danger text-white p-1 rounded" >{{order.status}}</span>
            </div>
                
       </div>
    </div>
</template>

<script>
import { orderCollection } from "../firebase";
import moment from "moment";
export default {
    name:"order",
    data(){
        return{
            orders:[]
        }
    },
    filters:{
        time(time){
            return  new moment(moment(time, 'HH:mm')).format('hh:mm A')
        },
        date(d){
              
                return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear()
        }
    },
    created(){

        

        if ('id' in this.$route.params) {
              orderCollection.where("uid", "==", this.$route.params.id).where("status", "==", "pending")
                .get()
                .then((snapshot)=>{
                            snapshot.forEach((doc)=>{
                                    this.orders.push(doc.data())
                            })
                    })
        }
    }
}
</script>
