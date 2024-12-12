<template>
  <div class="login-container">
    <h2 class="login-title">Aquatic pH Tracker</h2>
    <!-- Form to input username/email and password -->
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

    <!-- Show warning message if credentials are incorrect -->
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
      loginError: false, // Flag to indicate if login failed
    };
  },
  methods: {
    login() {
      // Simulate a simple validation (you can replace this with actual logic)
      const validUsername = 'Admin'; // Example username/email
      const validPassword = 'password123'; // Example password

      // Check if entered credentials match the valid ones
      if (this.username === validUsername && this.password === validPassword) {
        console.log('Login successful');
        this.loginError = false; // Hide error if login is successful
        this.$emit('loginSuccess'); // Emit login success event to parent
      } else {
        console.log('Invalid credentials');
        this.loginError = true; // Show error message if credentials are incorrect
      }
    },
  },
};
</script>

<style scoped>
/* Aquatic theme colors */
:root {
  --primary-color: #4CAF50; /* Aqua green */
  --secondary-color: #0a3d4d; /* Deep ocean blue */
  --background-color: #5c9e94; /* Light seafoam */
  --text-color: #000000; /* Black text */
  --button-hover-color: #388e3c; /* Darker green for button hover */
  --button-color: #ffffff; /* White background for the button */
  --button-text-color: #000000; /* Black text for the button */
  --light-blue: #a1d6e9; /* Light water blue */
  --seafoam-color: #99d1d1; /* Soft seafoam color */
  --wave-color: rgba(255, 255, 255, 0.6); /* Subtle wave effect */
}

/* General reset for body and page */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  background-image: linear-gradient(135deg, var(--light-blue), var(--seafoam-color)); /* Ocean wave gradient */
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  background-size: 400% 400%; /* Slow moving gradient effect */
  animation: gradientShift 10s ease infinite;
}


/* Centered container */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px; 
  padding: 40px 20px;
  background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent with white background */
  border-radius: 12px; /* Rounded corners for the container */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  border: 2px solid rgba(0, 0, 0, 0.1); /* Soft border */
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
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8); /* Subtle water ripple effect */
}

/* Input fields */
input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px; /* Rounded corners for inputs */
  background-color: rgba(255, 255, 255, 0.7); /* Slightly translucent background */
  color: #333;
  width: 100%;
  box-sizing: border-box; /* Ensures padding doesn't cause overflow */
  transition: border-color 0.3s ease;
}

/* Focus state for inputs */
input:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 5px rgba(72, 158, 136, 0.6); /* Glow effect when focused */
}

/* GitHub-style button */
button {
  padding: 12px;
  background-color: green; /* White background */
  color: var(--button-text-color); /* Black text */
  font-size: 16px;
  font-weight: 600; /* Bold text */
  border: 1px solid #098d2a;
  border-radius: 6px; /* Rounded corners */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth background and transform on hover */
  width: 100%;
  text-align: center;
  letter-spacing: 0.5px; /* Slight space between letters */
}

button:hover {
  
  background-color: darkgreen; 
  transform: translateY(-2px); /* Slight lift effect on hover */
}

button:focus {
  outline: none; /* Remove outline on focus */
  box-shadow: 0 0 0 2px rgba(72, 158, 136, 0.6); /* Focus outline for accessibility */
}

/* Error message styles */
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>
