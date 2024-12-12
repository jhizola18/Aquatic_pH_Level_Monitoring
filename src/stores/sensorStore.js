import { defineStore } from "pinia";

export const useSensorStore = defineStore("sensorStore", {
  state: () => ({
    pHLevel: null,        
    pHThresholds: {
      min: 4,             
      max: 9,             
    },
    alerts: [],          
    latestPHData: [],     
  }),
  actions: {
    handleIncomingData({ topic, message }) {
      if (topic === "sensors/ph") {
        this.pHLevel = message; 
        this.addPHData(message); 
        this.checkpHAlerts(message); 
      }
    },
    
    addPHData(pH) {
      // Add new data to the beginning of the array
      this.latestPHData.unshift({
        time: new Date().toLocaleTimeString(),
        phLevel: pH,
      });

      // Keep only the last 10 entries
      if (this.latestPHData.length > 10) {
        this.latestPHData.pop(); 
      }
    },
    checkpHAlerts(pH) {
      if (pH < this.pHThresholds.min) {
        this.addAlert("pH level is too low!", "red");
      } else if (pH > this.pHThresholds.max) {
        this.addAlert("pH level is too high!", "red");
      } else {
       
        this.removeAlert("pH level is too low!");
        this.removeAlert("pH level is too high!");
      }
    },
    addAlert(message, color) {
      // Prevent adding duplicate alerts
      if (!this.alerts.some(alert => alert.message === message)) {
        this.alerts.push({ message, color });
      }
    },
    removeAlert(alertMessage) {
      this.alerts = this.alerts.filter(alert => alert.message !== alertMessage);
    },
    setpHThresholds(min, max) {
      this.pHThresholds = { min, max };
    }
  },
  getters: {
    getLatestpHLevel: (state) => state.pHLevel,
    getAlerts: (state) => state.alerts,
    getLatestPHData: (state) => state.latestPHData, 
  }
});
