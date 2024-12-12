<template>
  <div id="app">
    <!-- If not logged in, show LoginPage -->
    <LoginPage v-if="!isLoggedIn" @loginSuccess="handleLoginSuccess" />

    <!-- If logged in, show SensorStore -->
    <SensorStore v-else />

    <!-- Show logout button if logged in -->
    <button v-if="isLoggedIn" @click="logout" class="button primary-button">Logout</button>
  </div>
</template>

<script>
import { stopSendingData } from "@/services/mqttService";
import LoginPage from './components/LoginPage.vue'; // Import the LoginPage component
import SensorStore from './components/SensorStore.vue'; // Import the SensorStore component

export default {
  name: 'App',
  components: {
    LoginPage,
    SensorStore, // Register both components
  },
  data() {
    return {
      isLoggedIn: false, // Track the login state
    };
  },
  methods: {
    handleLoginSuccess() {
      // This method will be called when login is successful
      this.isLoggedIn = true;
    },
    logout() {
    // Call to stop sending data
    stopSendingData();
    this.isLoggedIn = false;
    // Perform other logout actions, such as clearing user data or redirecting
    console.log("User logged out");
  },
  },
};
</script>

<style>
/* Ensure the whole page is covered by the background */
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
  min-height: 100vh; /* Ensure the content fills at least the full height of the viewport */

  /* Aquatic background image */
  background-image: url('@/assets/aquatic_bg.jpg'); /* Replace with your image path */
  background-size: cover; /* Ensures the image covers the entire screen */
  background-position: center; /* Centers the image */
  background-repeat: no-repeat; /* Prevents the image from repeating */
  color: white; /* Ensures text is visible over the background */
}

/* Optional: Add some padding to the button for styling */
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #d10d0d; /* Green background for the button */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #b10404; /* Darker green on hover */
}
</style>
