<template>
   <div class="container mt-4" >
        <div class="bg-white p-3">
            <div class="row">
                <div class="col-md-12 overflow-auto">
                    <form @submit.prevent="save" >
                        <table class="table" >
                    <thead>
                        <th style="width:100px;">Time</th>
                        <th style="width:100px;"  v-for="modelItem in pModel" :key="modelItem.id" > {{modelItem.name}} </th>
                    </thead>

                    <tbody>
                       <tr> 
                        <td style="width:100px;" >
                        <select v-model="timeSlot" class="" name="" id="" required>
                                <option   v-for="slot in getTimeSlotes" :value="slot.value" :key="slot.value"> {{slot.time}} {{slot.value}} </option>
                        </select>
                        </td>

                         <td style="width:100px;" v-for="modelItem in pModel" :key="modelItem.id" >
                            
                            <select  v-model="modelItem.digitOne"  class="" name="" id="" required>
                                <option v-for="number in numbers" :key="number" :value="number"> {{number}}</option>
                            </select>
                            
                            <select v-model="modelItem.digitTwo" class="" name="" id="" required>
                                <option v-for="number in numbers" :value="number" :key="number"> {{number}}</option>
                            </select>
                        </td> 

                     </tr> 
                    </tbody>
                </table>
                    <div class="ml-1">
                    <button class="btn  btn-sm btn-primary" >Publish</button>

                    </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="bg-white p-3 border mt-3">
            <div v-if="noResult" class="alert alert-danger ">No result found</div>
            <div class="row">
            <div class="col-md-12">
                <input  @change="fetchList" v-model="search"  class="form-control " type="date" name="" id="">
                <div class="mt-3">
                    <table class="table">
                        <thead>
                            <th class="text-uppercase"  >Time</th>
                            <th class="text-uppercase" v-for="p in  getProvider" :key="p.id+'_t'"  >{{p.name}}</th>
                            <th   class="text-uppercase"  >Action</th>
                        </thead>
                        <tbody>
                            <tr v-for="(tr, index) in list" :key="index+'_result'" >
                                <td> {{tr.timeSlot}} </td>
                               <td v-for="(td, i) in tr.result" :key="i" >
                                   <h6>{{td.initial}}{{td.digitOne}}{{td.digitTwo}}</h6>
                                </td>
                                <td >
                                    <button @click="deleteReuslt(tr.rid)" class="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
       </div>
        
   </div> 
</template>

<script>
import { resultCollection } from "../firebase";
import moment from "moment";
export default {
    name:'result',
    data(){
        return {
            provider: '',
            timeSlot: '',
            firstDigit: '',
            secondDigit: '',
            search:'',
            todayDate: '',
            pModel:[],
            list:[],
            noResult: false
           
        }
    },
   
    mounted(){
         let cd = new Date();
         this.todayDate = cd.getFullYear()  + '-' + 0 + (cd.getMonth() + 1) + '-' + cd.getDate();
         this.search = this.todayDate;

         this.fetchList();
          setTimeout(() => {
             this.getProvider.forEach((el, i) => {
                let obj = {
                    pos:i,
                    name:el.name,
                    initial:el.initial,
                    id:el.id,
                    digitOne:0,
                    digitTwo:0,
                }
                this.pModel.push(obj)
            }); 
          } , 1500);
    },
    computed:{
            getProvider(){
                return this.$store.getters.getTableData;
            },
            getTimeSlotes(){
                 return this.$store.getters.getTimeSlotes;
            },

            numbers(){
                return this.$store.getters.getNumbers;
            },
    },

    methods:{
        save(){

            
                

                if(!this.timeSlot){
                    alert('Please select time')
                    return;
                }

               this.$store.commit("showLoading")

                let result  = {
                    date: this.todayDate,
                    timeSlot : this.timeSlot,
                    timestamp: new Date(),
                    result: this.pModel
                }

        
                
                
                
                resultCollection.doc().set(result).then(()=>{
                  this.fetchList()
                   this.$store.commit("hideLoading")
                }).catch(err => {
                    alert(err)
                })
                    
        
                
        },
        fetchList(){

            let cd = new Date(this.search)
            let searchDate = cd.getFullYear()  + '-' + 0 + (cd.getMonth() + 1) + '-' + cd.getDate();

             this.$store.commit("showLoading")
             this.list = [];
            resultCollection
            .where("date", "==", searchDate)
            .get()
            .then(snapshot => {
                let temp = []
                if (snapshot.docs.length == 0) {
                    this.list = [];
                     this.$store.commit("hideLoading")
                     this.noResult = true
                     return

                }
                snapshot.docs.forEach(doc => {
                    let data  =  doc.data();
                    temp.push(data)
                    data.rid = doc.id
                });

                 this.list = temp.sort((a, b) => {
                                let timeSplita = a.timeSlot.split(":")
                                let timeSplitb = b.timeSlot.split(":")
                                let timeInta = parseInt(timeSplita[0] + timeSplita[1])
                                let timeIntb = parseInt(timeSplitb[0] + timeSplitb[1])
                                return  timeIntb - timeInta;
                            });
                this.noResult = false;
                this.$store.commit("hideLoading")

            })
            
        },

        deleteReuslt(id){   
                this.$store.commit("showLoading")
                resultCollection.doc(id).delete().then(()=>{
                     this.fetchList();   
                     this.$store.commit("hideLoading")
                }).catch(err => {
                    alert(err)
                })
        }

    }
    
}
</script>

<style>

</style>

