<template>
    <div class="container mt-4">
        <div class="bg-white border overflow-auto p-3">
            <div class="row">
                <div class="col-md-10">
                    <label for="">Date</label>
                    <input @change="fetchByDate" v-model="search" class="form-control mb-3"  type="date" name="" id="">
                </div>
                <div class="col-md-2">
                     <button class="btn btn-link btn-block " @click="fetchByDate" > Refresh </button>
                </div>
            </div>
            
            <div v-if="noResult"  class="alert alert-danger" >No result found</div>
            <table class="table" >
                <thead>
                    <th class="text-uppercase" >Time</th>
                    <th class="text-uppercase" v-for="th in thead" :key="th" >
                        {{th}}
                    </th>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in list" :key="i" >
                        <td>
                            {{item.timeSlot}}
                        </td>
                        <td v-for="result in item.result" :key="result.id" >
                            <h6>{{result.initial}}{{result.digitOne}}{{result.digitTwo}}</h6>
                        </td>
                    </tr>
                </tbody>
            </table>
            
        </div>
    </div>
</template>

<script>
import { resultCollection } from "../firebase";
import moment from "moment";
import { parse } from 'path';
export default {
    data(){
        return{
            search:'',
            todayDate:'',
            list:[],
            thead:[],
            noResult: false
        }
    },
    mounted(){
        let cd = new Date();
         this.todayDate = cd.getFullYear()  + '-' + 0 + (cd.getMonth() + 1) + '-' + cd.getDate();
         this.search = this.todayDate;
         
         this.fetchList().then(()=>{
             
             if (this.list.length > 0) {
                    if ('result' in this.list[0]) {

                            this.list[0].result.forEach(el =>{
                                        this.thead.push(el.name);
                            })

                    }                 
             }

         })
    },

    methods:{

        fetchByDate(){
            
            this.fetchList().then(()=>{
            
             if (this.list.length > 0) {
                   if (this.list) {
                        if ('result' in this.list[0]) {
                            this.list[0].result.forEach(el =>{
                                        this.thead.push(el.name);
                            })
                    } 
                   }                
             }
         })

        },

        fetchList(){

            let cd = new Date(this.search)
            let searchDate = cd.getFullYear()  + '-' + 0 + (cd.getMonth() + 1) + '-' + cd.getDate();
            
            this.$store.commit("showLoading")
              this.list  = [];
              this.thead = [];
            return new Promise(resolve =>{
                resultCollection
                .where("date", "==", searchDate)
                .get()
                .then(snapshot => {
                    
                    if (snapshot.docs.length == 0) {
                         this.$store.commit("hideLoading")   
                         this.list  = [];
                         this.thead = [];
                         this.noResult = true;
                         resolve()
                    }

                    let temp = [];

                    snapshot.docs.forEach(doc => {

                        let data = doc.data();
                        
                         if (moment(this.search).isBefore(moment().format('YYYY-MM-DD'))) {
                                temp.push(data)
                        }else{
                            if (moment(data.timeSlot, 'HH:mm').isSameOrBefore(moment(new moment(), 'HH:mm'))) {
                                    temp.push(data)
                            }
                        }

                      
                        this.$store.commit("hideLoading")
                        this.noResult = false;
                        
                    });
                
                this.list = temp.sort((a, b) => {
                            let timeSplita = a.timeSlot.split(":")
                            let timeSplitb = b.timeSlot.split(":")
                            let timeInta = parseInt(timeSplita[0] + timeSplita[1])
                            let timeIntb = parseInt(timeSplitb[0] + timeSplitb[1])
                            return  timeInta - timeIntb;
                });
                
                resolve()

                }).catch(err=>{
                    this.$store.commit("hideLoading")
                    alert(err)
                })
            })  
            
        },
    }
}
</script>

<style>

</style>
