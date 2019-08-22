<template>
    <div class="container  overflow-auto mt-4 border bg-white py-3">
            <table class="table" >
                    <thead>
                        <th>Name <input v-model="search" type="text" class="" placeholder="Search name" > </th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Wallet Balance</th>
                        <th>Win Balance</th>
                        <th>Admin</th>
                    </thead>
                    <tbody>
                        <tr :class="{'alert alert-info': user.admin}" v-for="user in filterData" :key="user.uid">
                            <td>{{user.name}}</td>
                            <td>{{user.email}}</td>
                            <td>{{user.phone}}</td>
                            <td>{{user.walletBalance}}</td>
                            <td>{{user.winBalance}}</td>
                            <td>{{user.admin ? 'YES' : 'NO'}}</td>
                        </tr>
                    </tbody>
            </table>
    </div>
</template>

<script>
import { usersCollection } from "../firebase";
export default {
    data(){
        return{
            search:'',
            users : [
               
            ]
        }
    },

    mounted(){
           this.$store.commit('showLoading')
        usersCollection.get().then(snapshot =>{
            if (snapshot.docs) {
                snapshot.docs.forEach(element => {
                    this.users.push(element.data())
                });

                   this.$store.commit('hideLoading')
            }
        })
    },

    computed:{
        filterData(){
           return this.users.filter(item =>{
               return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
           }) 
        }
    },

}
</script>

<style>

</style>
