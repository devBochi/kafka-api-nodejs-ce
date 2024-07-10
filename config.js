const {Kafka} = require("kafkajs");

const brokersArray = process.env.KAFKA_BROKERS.split(",")
console.log(brokersArray)

class KafkaConfig {
    constructor(){
        this.kafka = new Kafka({
            clientId: 'my-app',
            brokers: brokersArray,
            authenticationTimeout: 10000,
            reauthenticationThreshold: 10000,
            ssl: true,
            sasl: {
              mechanism: 'plain', // scram-sha-256 or scram-sha-512
              username: process.env.KAFKA_USER,
              password: process.env.KAFKA_PASSWORD
            },
        })
        this.admin = this.kafka.admin()
        this.producer = this.kafka.producer()
        this.consumer = this.kafka.consumer({groupId: 'test-group'})
    }

    async produce(topic,messages){
        try {
            await this.producer.connect()
            await this.producer.send({
                topic,
                messages
            })
        } catch (error) {
            console.log(error)
        } finally {
            await this.producer.disconnect()
        }
    }

    async consume(topic,callback){
        try {
            await this.consumer.connect()
            await this.consumer.subscribe({
                topic,
                fromBeginning: true
            })
            await this.consumer.run({
                eachMessage: async ({topic, partition, message}) => {
                    const value = message.value.toString()
                    callback(value)
                }
            })
        } catch (error) {
            console.log(error)
        } 
    }

    async createTopic(topicName){
        
        const topicConfig = {
            topic: topicName,
            numPartitions: 1,     // default: -1 (uses broker `num.partitions` configuration)
            replicationFactor: 3, // default: -1 (uses broker `default.replication.factor` configuration)
            replicaAssignment:[],  // Example: [{ partition: 0, replicas: [0,1,2] }] - default: []
            configEntries: []      // Example: [{ name: 'cleanup.policy', value: 'compact' }] - default: []
        }
        
        try {
            await this.admin.connect()
            console.log("Admin connected")
            const response = await this.admin.createTopics({
                timeout: 5000, // default
                topics: [topicConfig],
            })
            if (response) {
                console.log("Topic: " + topicName + " successfully created!")
            }
            await this.admin.disconnect()
            console.log("Admin connected")
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports =  KafkaConfig