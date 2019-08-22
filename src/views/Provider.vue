<template>
    <div class="mt-4 container" >
      <div class="row">
          <div class="col">
              <form @submit.prevent="save" class="bg-white border p-3">
                 <div class="row">
                     <div class="col-md-2">
                            Name
                            <input v-model="provider.name" minlength="3" class="form-control" type="text" required>
                     </div>
                      <div class="col-md-1">
                            Series
                            <input v-model="provider.series" class="form-control" maxlength="1" minlength="1" type="text"  required>
                     </div>
                        <div class="col-md-1">
                            Initial
                            <input v-model="provider.initial" class="form-control"  type="number"  required>
                     </div>
                     <div class="col-md-2">
                            Ticket rate
                            <input v-model="provider.rate" minlength="1" class="form-control" type="number" required>
                     </div>
                      <div class="col-md-2">
                            Win Price
                            <input v-model="provider.winPrice" minlength="1" class="form-control" type="number" >
                     </div>
                       <div class="col-md-2">
                            Color
                           <select v-model="provider.color"  class="form-control" name="" id="" required>
                             <option v-for="color in colors" :style="{color: color, height:'30px'}" :key="color" :value="color">{{color}}</option>
                         </select>
                     </div>
                     <div class="col-md-2">
                         <button class="btn mt-4 btn-block btn-primary">Add</button>
                     </div>
                 </div>
              </form>

              <div class="bg-white overflow-auto border p-3  mt-3">
                   <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Series</th>
                                <th scope="col">Initial</th>
                                <th scope="col">Ticket rate </th>
                                <th scope="col">Win Price</th>
                                <th scope="col">Color</th>
                                <th scope="col">Action </th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            <tr v-for="item in list" :key="item.id" >
                                <td>{{item.name}}</td>
                                <td>{{item.series}}</td>
                                <td>{{item.initial}}</td>
                                <td>{{item.rate}}</td>
                                <td>{{item.winPrice}}</td>
                                <td><span  :style="{color: item.color}" > {{item.color}}</span></td>
                                <td  class="text-danger"> <a href="JavaScript::void(0)" @click="deleteItem(item.id)" class="text-danger" >DELETE </a> </td>
                            </tr>
                        
                        </tbody>
                        </table>
              </div>
          </div>
      </div>
    </div>
</template>


<script>

import { providerCollection } from "../firebase";

export default {
    name:'provider',
    data(){
        return{
            provider:{
                name:'',
                series:'',
                initial:0,
                rate:0,
                winPrice:0,
                quantity:0,
                price:0,
                color:''
            },
            list:[],
            colors: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']
        }
    },

    mounted(){
        this.fetchList();
    },  

    methods:{
        save(){
            this.provider.rate = parseInt(this.provider.rate)
            this.provider.winPrice = parseInt(this.provider.winPrice)

            if(this.provider.rate == 0 || this.provider.winPrice ==0){
                    alert("Rate and winprice greater then 0")
                    return

            }

            providerCollection.doc().set(this.provider).then(()=>{
                this.fetchList()
            }).catch(err =>{
                alert(err)
            })
        },

        deleteItem(id){
            this.$store.commit('showLoading')
            providerCollection.doc(id).delete().then(()=>{
            this.fetchList()
             this.$store.commit('hideLoading')

            }).catch(err =>{
                alert(err)
            })
        },
        fetchList(){
            this.$store.commit('showLoading')
            providerCollection.get().then(snapshot=>{
                this.list = [];
               snapshot.docs.forEach(item => {
                   let data = item.data();
                   data.id = item.id
                   this.list.push(data)
               })

            this.list.sort(function (a, b) {
            if (a.series < b.series) { return -1; }
            if (a.series > b.series) { return 1; }
            return 0;
          })
            this.$store.commit('hideLoading')
            })
        }
    }
}
</script>

<style>

</style>

