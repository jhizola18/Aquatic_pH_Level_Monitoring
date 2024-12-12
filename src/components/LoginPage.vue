<template>
  <div class="login-container">
    <h2 class="login-title">Aquatic pH Tracker</h2>
    
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="username">Username or Email</label>
        <input 
          type="text" 
          id="username" 
          v-model="username" 
          placeholder="Enter your username or email" 
          required 
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          placeholder="Enter your password" 
          required 
        />
      </div>
      <button type="submit" class="login-button">Login</button>
    </form>

   
    <p v-if="loginError" class="error-message">Invalid username/email or password. Please try again.</p>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      loginError: false, 
    };
  },
  methods: {
    login() {
      // Simulate a simple validation (you can replace this with actual logic)
      const validUsername = 'Admin'; 
      const validPassword = 'password123'; 

      // Check if entered credentials match the valid ones
      if (this.username === validUsername && this.password === validPassword) {
        console.log('Login successful');
        this.loginError = false; 
        this.$emit('loginSuccess'); 
      } else {
        console.log('Invalid credentials');
        this.loginError = true; 
      }
    },
  },
};
</script>

<style scoped>

:root {
  --primary-color: #4CAF50; 
  --secondary-color: #0a3d4d; 
  --background-color: #5c9e94; 
  --text-color: #000000; 
  --button-hover-color: #388e3c; 
  --button-color: #ffffff; 
  --button-text-color: #000000; 
  --light-blue: #a1d6e9; 
  --seafoam-color: #99d1d1; 
  --wave-color: rgba(255, 255, 255, 0.6); 
}


html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  background-image: linear-gradient(135deg, var(--light-blue), var(--seafoam-color)); 
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  background-size: 400% 400%; 
  animation: gradientShift 10s ease infinite;
}



.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px; 
  padding: 40px 20px;
  background-color: rgba(255, 255, 255, 0.9); 
  border-radius: 12px; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
  border: 2px solid rgba(0, 0, 0, 0.1); 
}

.login-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  color: black;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}


.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group {
  margin-bottom: 16px;
}


label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: black;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); 
}


input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px; 
  background-color: rgba(255, 255, 255, 0.7); 
  color: #333;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}


input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(72, 158, 136, 0.6); 
}


button {
  padding: 12px;
  background-color: green; 
  color: var(--button-text-color); 
  font-size: 16px;
  font-weight: 600; 
  border: 1px solid #098d2a;
  border-radius: 6px; 
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease; 
  width: 100%;
  text-align: center;
  letter-spacing: 0.5px; 
}

button:hover {
  
  background-color: darkgreen; 
  transform: translateY(-2px); 
}

button:focus {
  outline: none; 
  box-shadow: 0 0 0 2px rgba(72, 158, 136, 0.6); 
}


.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
