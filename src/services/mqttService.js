
import { database } from "@/firebaseConfig";
import { ref, set } from "firebase/database";
import mqtt from "mqtt";

let client = null;

export const connectMQTT = (brokerUrl, options) => {
  client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
  });

  client.on("error", (err) => {
    console.error("MQTT connection error:", err);
  });
};

export const subscribeToTopic = (topics, callbacks) => {
  if (client) {
    topics.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic: ${topic}`);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    });

    client.on("message", (topic, message) => {
      const messageStr = message.toString();
      console.log("Received message:", messageStr, "on topic:", topic);

      if (callbacks[topic]) {
        callbacks[topic](messageStr);
      }

      // Send data to Firebase
      sendDataToFirebase(topic, messageStr);
    });
  }
};

const sendDataToFirebase = (topic, message) => {
  // Get the current time in UTC
  const now = new Date();
  
  // Firebase stores UTC timestamps
  const timestamp = now.getTime();  // UTC timestamp in milliseconds
  
  // Format the date as YYYY-MM-DD for Firebase
  const date = now.toISOString().split('T')[0];  // UTC date (YYYY-MM-DD)
  
  
  // Firebase reference organized by date and timestamp
  const firebaseRef = ref(database, `mqttData/${date}/${topic}/${timestamp}`);

  set(firebaseRef, {
    topic,
    message,
    date,
    timestamp,
  })
    .then(() => {
      console.log("Data saved to Firebase successfully");
    })
    .catch((error) => {
      console.error("Error saving data to Firebase:", error);
    });
};





