const KafkaConfig = require("./config");

const sendMessageToKafka = async (req, res) => {
    try {
        const { topic , message } = req.body
        const kafka = new KafkaConfig()
        const messages = [
            { key: 'key1', value: message }
        ]
        kafka.produce(topic, messages);
        res.status(200).json({
            status: "OK",
            message: "Message successfully send!"
        })
    } catch (error) {
        console.log(error)
    }
}

const createTopic = async (req, res) => {
    try {
        const { topicName } = req.body
        const kafka = new KafkaConfig()
        kafka.createTopic(topicName);
        res.status(200).json({
            status: "OK",
            message: "Confirmed"
        })
    } catch (error) {
        console.log(error)
    }
}

const controllers = { sendMessageToKafka, createTopic }

module.exports = controllers;