<template>
    <div class="container mt-5" >
        <div class="row" >
                <div class="col-md-6">
                    <div class="bg-white p-2">
            <div class="bg-primary " >
                <ul class="list-group">
                    <li class="list-group-item active ">Dashboard</li>
                    <li class="list-group-item d-flex  justify-content-between"> <router-link to="/dashboard/result" >Result </router-link>   </li>
                    <li class="list-group-item d-flex  justify-content-between"><router-link to="/dashboard/time" >Time </router-link>  </li>
                    <li class="list-group-item d-flex  justify-content-between"><router-link to="/dashboard/users" >Users </router-link>  </li>
                    <li class="list-group-item d-flex  justify-content-between"> <router-link to="/dashboard/provider" >Lottary provider </router-link> </li>
                </ul>
            </div>
        </div>
                </div>
        </div>
    </div>
</template>
