import Vue from 'vue'
import Vuex from 'vuex'
import moment from "moment";
import {usersCollection, walletCollection, providerCollection, timeCollection, resultCollection} from "./firebase";


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    numbers: [...Array(10).keys()],
    loading: false,
    currentResult:{},
    timeSlots: [],
    user: null,
    start: '9:00',
    end: '21:00',
    nextDrawTime: '00:00',
    todayDate: moment().utc().format('LL'),
    division: 30,
    tableHead: [
      'name',
      'series',
      'win',
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      'quantity',
      'amount',
  
    ],
    providers:[],
    grandTotalTicket: 0,
    grandTotalPrice: 0
  },

  getters: {
    getTableHead: state => {
      return state.tableHead
    },

    getTodayDate: state => {
      return state.todayDate
    },

    getGrandTotalTicket: state => {
      return state.grandTotalTicket;
    },

    getGrandTotalPrice: state => {
      return state.grandTotalPrice;
    },

    getTableData: state => {
      return state.providers;
    },
    getNumbers: state => {
      return state.numbers;
    },
    grandTotalCount: state => {
      return state.totalTicket;
    },

    getTotalPrice: state => {
      return state.totalPrice;
    },

    getTimeSlotes: state => {
      return state.timeSlots
    },

    getDivision: state => {
      return state.division;
    },

    getUserData: state => {
       return state.user;
     },

    getNextDrawTime: state => {
      return {
        next: state.nextDrawTime.time,
      };
    },

    getCurrentResult: state => {
      return state.currentResult;
    }
  },

  mutations: {
    setQuantityAndPrice(state, {
      index,
      quantity,
      price
    }) {
      state.providers[index].quantity = quantity;
      state.providers[index].price = price;
    },

    setGrandPriceQuantity(state, {
      grandPrice,
      grandQuantity
    }) {
      state.grandTotalPrice = grandPrice;
      state.grandTotalTicket = grandQuantity;
    },

    setTimeSlot(state, timeSlots) {
      state.timeSlots = timeSlots;
    },

    setNextDarwTime(state, {nextDrawTime}) {
     
      state.nextDrawTime = nextDrawTime;
    },

    setCurrentUser(state, user){
      window.localStorage.setItem('auth', JSON.stringify(user));
      state.user = user;
    },

    showLoading(state) {
      state.loading = true;
    },

    hideLoading(state) {
      state.loading = false;
    },

    setWalleteBalance(state, balance) {
      state.user.walletBalance = balance;
    },

    setProviderData(state, providers){
        state.providers = providers
    },

    setTimeData(state, data){
      state.division = data.slot
      state.start = data.st
      state.end = data.et
    },

    setCurrentResult(state, result){
      state.currentResult = result;
    }



  },
  actions: {
    updateWallet({commit, state}){

      return new Promise((resolve, reject)=>{

        let walletBalance = state.user.walletBalance;
        let uid = state.user.uid;
        let newBalance = walletBalance - state.grandTotalPrice;

        if (state.grandTotalPrice > walletBalance) {
               reject("You don't have enough Balance")
        }else{
           usersCollection.doc(uid).update({
             walletBalance: newBalance
           }).then(()=>{
              walletCollection.doc(uid)
              .update({
                balance: newBalance
              })
              .then(() => {
                  commit('setWalleteBalance', newBalance)
                  resolve()
              })
           })
        }
      })
    },

    signOut({commit}){  
          commit('setCurrentUser', null)
    },

     setCurrentUser({commit}, user){
          commit('setCurrentUser', user)
    },

    setQuantityAndPrice({
      commit
    }, payload) {
      commit('setQuantityAndPrice', payload)
    },

    grandPriceQuantity({
      commit,
      state
    }) {
      let grandPrice = 0;
      let grandQuantity = 0;
      state.providers.forEach((item) => {
        grandPrice += item.price;
        grandQuantity += item.quantity;
      })

      commit('setGrandPriceQuantity', {
        grandPrice,
        grandQuantity
      })

    },

    generateTimeSlots({ commit, state }) {
      return new Promise((resolve) => {

        let start = state.start;
        let end = state.end;
        let division = state.division

        var startTime = moment(start, 'HH:mm');
        var endTime = moment(end, 'HH:mm');

        if (endTime.isBefore(startTime)) {
          endTime.add(1, 'day');
        }

        var timeStops = [];

        while (startTime <= endTime) {
          let value = new moment(startTime).format('HH:mm');
          let time = new moment(startTime).format('hh:mm A');

          timeStops.push({
            time: time,
            value: value,
            active: moment(value, 'HH:mm').isSameOrAfter(moment(new moment(), 'HH:mm'))
          });
          startTime.add(division, 'minutes');
        }

        commit('setTimeSlot', timeStops)
        resolve();
      })

    },

    calulateNextDrawTime({commit, state}) {

      let times = state.timeSlots;
      let endTime = state.end;
      let start = state.start;
    
      let ct = moment(new moment(), 'HH:mm');

      if (moment(endTime, 'HH:mm').isSameOrBefore(ct)){

          let nextDrawTime = {
            time:  moment(start, 'HH:mm').format('hh:mm A')
          }

           commit('setNextDarwTime', {
             nextDrawTime,
           })

           return;
          
      }
      
      let nextDrawTime = times.find(slot => {
        if (moment(slot.value, 'HH:mm').isAfter(ct)) {
            return slot;
        }
      })


      commit('setNextDarwTime', {
        nextDrawTime,
      })
    },

    fetchProvider({commit}){

      let temp = []
        providerCollection.get().then(snapshot =>{
          snapshot.docs.forEach(doc =>{
             let data = doc.data()
             data.id = doc.id
              temp.push(data)
          })

          temp.sort(function (a, b) {
            if (a.series < b.series) { return -1; }
            if (a.series > b.series) { return 1; }
            return 0;
          })

          commit('setProviderData', temp)
        })
    },

    fetchCurrentResult({commit}){

      let cd = new Date()
      let date = `${cd.getFullYear()}-0${cd.getMonth() + 1}-${cd.getDate()}`

        resultCollection
          .where("date", "==", date)
          .get()
          .then(snapshot => {
            let len = snapshot.docs.length
            if (len > 0) {
              
              for (let index = 0; index < len ; index++) {
                const result = snapshot.docs[index];
                let data = result.data();
                 if (moment(data.timeSlot, 'HH:mm').isSameOrBefore(moment(new moment(), 'HH:mm'))) {
                   commit("setCurrentResult", data);
                   break;
                 }
                
              }
        
             
            }else{
             console.log('no current result found');
             
            }

          }).catch(err => {
            alert(err)
          })
    },

   fetchTimeSetting({commit}){
        return new Promise(resolve => {
           timeCollection.get().then(snapshot => {
               if (snapshot.docs.length > 0) {
                   commit('setTimeData', snapshot.docs[0].data())
                   resolve()
               }
           })
        })   
   }

  }
})
