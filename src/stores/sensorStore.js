import { defineStore } from "pinia";

export const useSensorStore = defineStore("sensorStore", {
  state: () => ({
    pHLevel: null,        // Latest pH level value
    pHThresholds: {
      min: 4,             // Minimum pH threshold (default 4.0)
      max: 9,             // Maximum pH threshold (default 9.0)
    },
    alerts: [],           // Array to store active alerts
    latestPHData: [],     // Store last 10 pH data entries
  }),
  actions: {
    handleIncomingData({ topic, message }) {
      if (topic === "sensors/ph") {
        this.pHLevel = message; // Update pH level
        this.addPHData(message); // Add new pH data to latestPHData
        this.checkpHAlerts(message); // Check alerts after pH level is updated
      }
    },
    // Add new data to the latestPHData array
    addPHData(pH) {
      // Add new data to the beginning of the array
      this.latestPHData.unshift({
        time: new Date().toLocaleTimeString(),
        phLevel: pH,
      });

      // Keep only the last 10 entries
      if (this.latestPHData.length > 10) {
        this.latestPHData.pop(); // Remove the oldest entry
      }
    },
    checkpHAlerts(pH) {
      if (pH < this.pHThresholds.min) {
        this.addAlert("pH level is too low!", "red");
      } else if (pH > this.pHThresholds.max) {
        this.addAlert("pH level is too high!", "red");
      } else {
        // Remove pH level alerts when within the normal range
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
    getLatestPHData: (state) => state.latestPHData, // Get the latest 10 pH data entries
  }
});
