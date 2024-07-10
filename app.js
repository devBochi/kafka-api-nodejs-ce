const bodyParser = require("body-parser")
const express = require("express");
const controllers = require("./controller");
// const KafkaConfig = require("./config");

const myTopic = process.env.KAFKA_TOPIC

const app = express();
const jsonParser = bodyParser.json()

app.post('/api/create',jsonParser, controllers.createTopic)

app.post('/api/send',jsonParser, controllers.sendMessageToKafka)

// const kafka = new KafkaConfig()
// kafka.consume(myTopic,(value)=>{
//     console.log("Message consumed:" + value)
// })

app.listen(8080, ()=> {
    console.log("Kafka API is listening on port 8080")
})