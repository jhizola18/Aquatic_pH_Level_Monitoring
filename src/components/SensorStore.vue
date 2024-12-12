<template>
  <div class="container">
   
    <div class="box-container">
     
<section class="box realtime-box">
  <h2 class="box-title">Real-Time pH Level Data</h2>
  <div class="box-content">
    <div class="data-item">
      <strong>pH Level:</strong>
      <span v-if="isMonitoring">{{ latestpHLevel }}</span>
      <span v-else>N/A</span>
    </div>

   
    <canvas id="phGauge" ref="phGaugeCanvas"></canvas>

    <div class="alert-section">
      <div
        v-for="alert in alerts"
        :key="alert.message"
        :style="{ backgroundColor: alert.color, color: 'white' }"
        class="alert"
      >
        <strong>{{ alert.message }}</strong>
      </div>
    </div>
  </div>
</section>



     
      <section class="box threshold-box">
        <h2 class="box-title">pH Thresholds for Fish Tolerance</h2>
        <div class="box-content">
          
          <div class="fish-selection">
            <label for="fishType">Select Fish Type:</label>
            <select v-model="selectedFish" @change="checkPHThreshold">
              <option value="bangus">Bangus (Milkfish)</option>
              <option value="tilapia">Tilapia</option>
              <option value="mudcrab">Mudcrab</option>
              <option value="shrimp">Shrimp</option>
              <option value="galunggong">Galunggong</option>
            </select>
          </div>

         
          <div v-if="selectedFish === 'bangus'">
            <p><strong>pH level for Bangus:</strong> between 6.5 and 8.5</p>
          </div>
          <div v-if="selectedFish === 'tilapia'">
            <p><strong>pH level for Tilapia:</strong> between 6.0 and 8.5</p>
          </div>
          <div v-if="selectedFish === 'mudcrab'">
            <p><strong>pH level for mudcrab:</strong> between 6.5 and 8.0</p>
          </div>
          <div v-if="selectedFish === 'shrimp'">
            <p><strong>pH level for shrimp:</strong> between 7.5 and 8.5</p>
          </div>
          <div v-if="selectedFish === 'galunggong'">
            <p><strong>pH level for galunggong:</strong> between 6.5 and 8.5</p>
          </div>
        </div>
      </section>

      <!-- Historical Data Box -->
      <section class="box historical-box" v-if="historicalData.length > 0">
        <h2 class="box-title">Historical pH Data for {{ selectedDate }}</h2>
        <div class="box-content">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>pH Level</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in historicalData" :key="index">
                <td>{{ entry.time }}</td>
                <td>{{ entry.phLevel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

  
    <div class="divider"></div>

    
    <section class="monitoring-section">
      <h3>Start Monitoring pH Level</h3>
      <button @click="toggleMonitoring" class="button primary-button">
  {{ isMonitoring ? 'Stop Monitoring' : 'Start Monitoring' }}

      </button>
    </section>
  </div>
</template>




<script>
import { connectMQTT, subscribeToTopic } from "@/services/mqttService";
import { useSensorStore } from "@/stores/sensorStore";
import { get, getDatabase, ref } from "firebase/database";


export default {
  data() {
    return {
      selectedDate: "", 
      historicalData: [], 
      alerts: [], 
      selectedFish: "bangus", 
      isMonitoring: false, 
    };
  },
  computed: {
  latestpHLevel() {
    
    if (!this.isMonitoring) {
      return "N/A";
    }
    const sensorStore = useSensorStore();
    return sensorStore.getLatestpHLevel || "N/A"; 
  },
},

  methods: {

   
    
    toggleMonitoring() {
    this.isMonitoring = !this.isMonitoring;

    if (this.isMonitoring) {
      
      this.startMonitoring();
    } else {
      
      this.stopMonitoring();
    }
  },


    
    startMonitoring() {
  console.log("Monitoring started");

  const brokerUrl = "wss://ed9b94fcc7ad47119453174c68d2ae31.s1.eu.hivemq.cloud:8884/mqtt";
  const options = {
    username: "Admin",
    password: "Admin123",
  };

  
  connectMQTT(brokerUrl, options);

  const sensorStore = useSensorStore();

  const topics = ["sensors/ph"]; 
  const callbacks = {
    "sensors/ph": (message) => {
      const pHData = parseFloat(message);
      if (!isNaN(pHData)) {
        sensorStore.handleIncomingData({
          topic: "sensors/ph",
          message: pHData,
        });
      }
    },
  };

  
  this.subscription = subscribeToTopic(topics, callbacks);

  
  this.checkPHThreshold();
},





   
    stopMonitoring() {
  console.log("Monitoring stopped");

 
  if (this.subscription && typeof this.subscription.unsubscribe === "function") {
    this.subscription.unsubscribe();
    console.log("Unsubscribed from the topic");
  } else {
    console.warn("No active subscription to unsubscribe from");
  }

  // Access the MQTT client from the store and unsubscribe
  const mqttClient = useSensorStore().mqttClient; 
  if (mqttClient) {
    
    mqttClient.unsubscribe("sensors/ph", (err) => {
      if (err) console.error("Error unsubscribing from sensors/ph:", err);
      else console.log("Unsubscribed from sensors/ph");
    });

   
    mqttClient.end(false, () => {
      console.log("MQTT client disconnected");
    });
  } else {
    console.warn("No MQTT client available");
  }

  
  this.alerts = [];
},



    // Fetch historical data for the selected date
    fetchDataByDate() {
      console.log("Selected date:", this.selectedDate); 

      if (!this.selectedDate) {
        console.error("No date selected");
        return;
      }

      const db = getDatabase();
      const dbRef = ref(db, `sensorData/${this.selectedDate}`);

      get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Fetched data:", data); 

           
            this.historicalData = Object.entries(data).map(([, entry]) => ({
              time: entry.time, 
              phLevel: entry.phLevel, 
            }));
            console.log("Formatted data:", this.historicalData); 
          } else {
            console.warn("No data available for the selected date");
            this.historicalData = []; 
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.historicalData = []; 
        });
    },
    
    

    // Existing method to check pH thresholds
    checkPHThreshold() {
    const bangusMin = 6.5;
    const bangusMax = 8.5;
    const tilapiaMin = 6.0;
    const tilapiaMax = 8.5;
    const mudcrabMin = 6.5;
    const mudcrabMax = 8.0;
    const shrimpMin = 7.5;
    const shrimpMax = 8.5;
    const galunggongMin = 6.5;
    const galunggongMax = 8.5;

    let newAlerts = [];

    // Check pH thresholds based on the selected fish
    if (this.selectedFish === "bangus") {
      if (this.latestpHLevel < bangusMin) {
        newAlerts.push({
          message: "pH level is too low for Bangus (below 6.5).",
          color: "red",
        });
      } else if (this.latestpHLevel > bangusMax) {
        newAlerts.push({
          message: "pH level is too high for Bangus (above 8.5).",
          color: "red",
        });
      }
    } else if (this.selectedFish === "tilapia") {
      if (this.latestpHLevel < tilapiaMin) {
        newAlerts.push({
          message: "pH level is too low for Tilapia (below 6.0).",
          color: "red",
        });
      } else if (this.latestpHLevel > tilapiaMax) {
        newAlerts.push({
          message: "pH level is too high for Tilapia (above 8.5).",
          color: "red",
        });
      }
    } else if (this.selectedFish === "mudcrab") {
      if (this.latestpHLevel < mudcrabMin) {
        newAlerts.push({
          message: "pH level is too low for Mudcrab (below 6.5).",
          color: "red",
        });
      } else if (this.latestpHLevel > mudcrabMax) {
        newAlerts.push({
          message: "pH level is too high for Mudcrab (above 8.0).",
          color: "red",
        });
      }
    } else if (this.selectedFish === "shrimp") {
      if (this.latestpHLevel < shrimpMin) {
        newAlerts.push({
          message: "pH level is too low for Shrimp (below 7.5).",
          color: "red",
        });
      } else if (this.latestpHLevel > shrimpMax) {
        newAlerts.push({
          message: "pH level is too high for Shrimp (above 8.5).",
          color: "red",
        });
      }
    } else if (this.selectedFish === "galunggong") {
      if (this.latestpHLevel < galunggongMin) {
        newAlerts.push({
          message: "pH level is too low for Galunggong (below 6.5).",
          color: "red",
        });
      } else if (this.latestpHLevel > galunggongMax) {
        newAlerts.push({
          message: "pH level is too high for Galunggong (above 8.5).",
          color: "red",
        });
      }
    }

   
    this.alerts = newAlerts;
  },
  },
};
</script>



<style scoped>

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f4f7fb;
  color: black; 
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: rgba(255, 255, 255, 0.7); 
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}


.box-container {
  display: flex;
  justify-content: space-between; 
  gap: 20px; 
  flex-wrap: wrap; 
  background: rgba(255, 255, 255, 0.6); 
}


.box {
  background-color: rgba(255, 255, 255, 0.7); 
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  flex: 1 1 30%; 
  min-width: 280px; 
}


.box-title {
  font-size: 1.5rem;
  color: black; 
  margin-bottom: 15px;
  font-weight: bold;
}

.box-content {
  font-size: 1.1rem;
  color: black; 
}


.data-item {
  font-size: 1.2rem;
  margin: 10px 0;
  color: black; 
}

.alert-section .alert {
  padding: 15px;
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 5px;
  color: rgb(0, 0, 0); 
}


.button {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.primary-button {
  background-color: #3498db;
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: #2980b9;
}

.monitoring-section h3 {
  color: black; 
}


.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.data-table th, .data-table td {
  border: 1px solid #833434;
  padding: 12px;
  text-align: left;
  color: black; 
}

.data-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tbody tr:hover {
  background-color: #f1f1f1;
}


.fetch-data-section {
  text-align: center;
  margin-top: 30px;
}

.fetch-data-section input {
  padding: 10px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.fetch-data-section button {
  margin-left: 10px;
}


.divider {
  margin: 20px 0;
  height: 1px;
  background-color: #ddd;
}


@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .box-container {
    flex-direction: column; 
  }

  .data-table {
    font-size: 0.9rem;
  }
}

</style>
