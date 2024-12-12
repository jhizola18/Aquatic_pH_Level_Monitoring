<template>
  <div id="app">
    
    <LoginPage v-if="!isLoggedIn" @loginSuccess="handleLoginSuccess" />

 
    <SensorStore v-else />

    
    <button v-if="isLoggedIn" @click="logout" class="button primary-button">Logout</button>
  </div>
</template>

<script>
import { stopSendingData } from "@/services/mqttService";
import LoginPage from './components/LoginPage.vue';
import SensorStore from './components/SensorStore.vue';

export default {
  name: 'App',
  components: {
    LoginPage,
    SensorStore, 
  },
  data() {
    return {
      isLoggedIn: false, 
    };
  },
  methods: {
    handleLoginSuccess() {
      
      this.isLoggedIn = true;
    },
    logout() {
    // Call to stop sending data
    stopSendingData();
    this.isLoggedIn = false;
    
    console.log("User logged out");
  },
  },
};
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; 

 
  background-image: url('@/assets/aquatic_bg.jpg'); 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
  color: white; 
}


button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #d10d0d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #b10404; 
}
</style>
