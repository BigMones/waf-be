// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  CORE MODULE: KAFKA
//
// ------------------------------------------------------------------------- //
//  ESLINT CONFIGURATION
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Load modules
const { Kafka, logLevel } = require('kafkajs');
const { v4 } = require('uuid');

// ------------------------------------------------------------------------- //
//  COMMON DATA
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: BASE CALL
// ------------------------------------------------------------------------- //

// Create base class
class __KafkaAgent {
    constructor() {
        // -------------------------------------------------------------------|
        //  PREPARE DATA
        // -------------------------------------------------------------------|

        // Create id
        this.instanceId = "kafka-agent-" + Date.now();

        // -------------------------------------------------------------------|
        //  PREPARE STORAGE
        // -------------------------------------------------------------------|

        // Init settings
        this.__settings = null;

        // Init connection handler
        this.__producer = null;
        this.__consumer = null;
        this.__admin    = null;

        // -------------------------------------------------------------------|
        //  PREPARE LOGGER
        // -------------------------------------------------------------------|

        // Set default functions
        this.logger = {
            info:  () => {},
            warn:  () => {},
            error: () => {}
        };
    }

    init (p_configs, p_logger = {}) {
        // -------------------------------------------------------------------|
        //  PREPARE SETTINGS
        // -------------------------------------------------------------------|

        // Save default settings
        let settings = {
            enable:             false,
            brokers:            null,
            connectionTimeout:  null,
            requestTimeout:     null
        };

        // -------------------------------------------------------------------|
        //  MERGE SETTINGS
        // -------------------------------------------------------------------|

        // Save new settings
        this.__settings = {
            ...settings,
            ...(p_configs ? p_configs : {})
        };
        // -------------------------------------------------------------------|
        //  MERGE LOGGER
        // -------------------------------------------------------------------|

        // Save new logger
        this.logger = {
            ...this.logger,
            ...(p_logger ? p_logger : {})
        };
    }

    __client() {
        // Init connection handler
        return (new Kafka({
            logLevel:          logLevel.INFO,
            brokers:           this.__settings.brokers,
            clientId:          'kafka-client-nodejs',
            connectionTimeout: this.__settings.connectionTimeout,
            requestTimeout:    this.__settings.requestTimeout,
            logCreator:        (logLevel) => {
                // Send back new logger logic
                // eslint-disable-next-line no-unused-vars
                return ({ namespace, level, label, log }) => {
                    // Prepare data
                    const { message, ...extra } = log;

                    // Mapping...
                    switch(level) {
                        case logLevel.ERROR:
                        case logLevel.NOTHING:
                            // Send to specified logger
                            return this.logger.error(`[${namespace}] ${message}  ::-->>  ${JSON.stringify(extra, null, 4)}`);
                        case logLevel.WARN:
                            // Send to specified logger
                            return this.logger.warn(`[${namespace}] ${message}  ::-->>  ${JSON.stringify(extra, null, 4)}`);
                        case logLevel.INFO:
                        case logLevel.DEBUG:
                        default:
                            // Send to specified logger
                            return this.logger.info(`[${namespace}] ${message}  ::-->>  ${JSON.stringify(extra, null, 4)}`);
                    }
                }
            }
        }));
    }

    // Get pointer to kafka connection
    createProducer(pGroupId = v4()) {
        // Create promise
        return (new Promise((resolve, reject) => {
            // Check if enable
            if (!this.__settings.enable) {
                // Send debug message
                this.logger.error("KafkaAgent.Engine():  ERROR  ::-->>  KafkaAgent is not enabled!");

                // Block execution
                return reject(new Error("KafkaAgent is not enabled!"));
            }

            // Check if already spawn
            if (this.__producer) {
                // Send back client
                return resolve(this.__producer);
            }

            // Create producer
            this.__producer = this.__client().producer({
                groupId: pGroupId
            });

            // Connect producer
            this.__producer.connect()
            .then(() => {
                // Bind event to logger
                // CONNECT:            'producer.connect',
                // DISCONNECT:         'producer.disconnect',
                // REQUEST:            'producer.network.request',
                // REQUEST_TIMEOUT:    'producer.network.request_timeout',
                // REQUEST_QUEUE_SIZE: 'producer.network.request_queue_size'
                [
                    'producer.connect',
                    'producer.disconnect',
                    'producer.network.request',
                    'producer.network.request_timeout',
                    'producer.network.request_queue_size'
                ].map((event) => {
                    // Register for event
                    this.__producer.on(event, this.__evt_producer_listener.bind(this));
                });

                // Send pointer
                resolve(this.__producer);
            })
            .catch((err) => {
                // Send debug message
                this.logger.error("KafkaAgent.ConnectionStatus('producer'):  ERROR  ::-->>  " + JSON.stringify(
                    err, null, 4
                ));

                // Block execution
                reject(err);
            });
        }));
    }

    // Get pointer to kafka connection
    destroyProducer() {
        // Create promise
        return (new Promise((resolve, reject) => {
            // Check if enable
            if (!this.__settings.enable) {
                // Send debug message
                this.logger.warn("KafkaAgent.Engine():  Kafka system is not enabled!");
                return resolve(null);
            }

            // Check if already spawn
            if (!(this.__producer)) {
                // Block execution
                return reject(new Error("KafkaAgent<producer> is not spawned!"));
            }

            // Connect producer
            this.__producer.disconnect()
            .then((resClient) => {
                // Clear pointer
                this.__producer = null;

                // Send pointer
                resolve(resClient);
            })
            .catch((err) => {
                // Send debug message
                this.logger.error("KafkaAgent.DisconnectionStatus('producer'):  ERROR  ::-->>  " + JSON.stringify(
                    err, null, 4
                ));

                // Block execution
                reject(err);
            });
        }));
    }

    // Get pointer to kafka connection
    createConsumer(pGroupId = v4()) {
        // Create promise
        return (new Promise((resolve, reject) => {
            // Check if enable
            if (!this.__settings.enable) {
                // Send debug message
                this.logger.warn("KafkaAgent.Engine():  Kafka system is not enabled!");
                return resolve(null);
            }

            // Check if already spawn
            if (this.__consumer) {
                // Send back client
                return resolve(this.__consumer);
            }

            // Create consumer
            this.__consumer = this.__client().consumer({
                groupId: pGroupId
            });

            // Connect consumer
            this.__consumer.connect()
            .then(() => {
                // Bind event to logger
                // HEARTBEAT:                    'consumer.heartbeat',
                // COMMIT_OFFSETS:               'consumer.commit_offsets',
                // GROUP_JOIN:                   'consumer.group_join',
                // FETCH:                        'consumer.fetch',
                // FETCH_START:                  'consumer.fetch_start',
                // START_BATCH_PROCESS:          'consumer.start_batch_process',
                // END_BATCH_PROCESS:            'consumer.end_batch_process',
                // CONNECT:                      'consumer.connect',
                // DISCONNECT:                   'consumer.disconnect',
                // STOP:                         'consumer.stop',
                // CRASH:                        'consumer.crash',
                // RECEIVED_UNSUBSCRIBED_TOPICS: 'consumer.received_unsubscribed_topics',
                // REQUEST:                      'consumer.network.request',
                // REQUEST_TIMEOUT:              'consumer.network.request_timeout',
                // REQUEST_QUEUE_SIZE:           'consumer.network.request_queue_size'
                [
                    'consumer.heartbeat',
                    'consumer.commit_offsets',
                    'consumer.group_join',
                    'consumer.fetch',
                    'consumer.fetch_start',
                    'consumer.start_batch_process',
                    'consumer.end_batch_process',
                    'consumer.connect',
                    'consumer.disconnect',
                    'consumer.stop',
                    'consumer.crash',
                    'consumer.received_unsubscribed_topics',
                    'consumer.network.request',
                    'consumer.network.request_timeout',
                    'consumer.network.request_queue_size'
                ].map((event) => {
                    // Register for event
                    this.__consumer.on(event, this.__evt_consumer_listener.bind(this));
                });

                // Send pointer
                resolve(this.__consumer);
            })
            .catch((err) => {
                // Send debug message
                this.logger.error("KafkaAgent.ConnectionStatus('consumer'):  ERROR  ::-->>  " + JSON.stringify(
                    err, null, 4
                ));

                // Block execution
                reject(err);
            });
        }));
    }

    // Get pointer to kafka connection
    destroyConsumer() {
        // Create promise
        return (new Promise((resolve, reject) => {
            // Check if enable
            if (!this.__settings.enable) {
                // Send debug message
                this.logger.warn("KafkaAgent.Engine():  Kafka system is not enabled!");
                return resolve(null);
            }

            // Check if already spawn
            if (!(this.__consumer)) {
                // Block execution
                return reject(new Error("KafkaAgent<consumer> is not spawned!"));
            }

            // Connect producer
            this.__consumer.disconnect()
            .then((resClient) => {
                // Clear pointer
                this.__consumer = null;

                // Send pointer
                resolve(resClient);
            })
            .catch((err) => {
                // Send debug message
                this.logger.error("KafkaAgent.DisconnectionStatus('consumer'):  ERROR  ::-->>  " + JSON.stringify(
                    err, null, 4
                ));

                // Block execution
                reject(err);
            });
        }));
    }

    // Get pointer to kafka connection
    createAdmin() {
        // Create promise
        return (new Promise((resolve, reject) => {
            // Check if enable
            if (!this.__settings.enable) {
                // Send debug message
                this.logger.warn("KafkaAgent.Engine():  Kafka system is not enabled!");
                return resolve(null);
            }

            // Check if already spawn
            if (this.__admin) {
                // Send back client
                return resolve(this.__admin);
            }

            // Create admin
            this.__admin = this.__client().admin();

            // Connect admin
            this.__admin.connect()
            .then(() => {
                // Send pointer
                resolve(this.__admin);
            })
            .catch((err) => {
                // Send debug message
                this.logger.error("KafkaAgent.ConnectionStatus('admin'):  ERROR  ::-->>  " + JSON.stringify(
                    err, null, 4
                ));

                // Block execution
                reject(err);
            });
        }));
    }

    // Get pointer to kafka connection
    destroyAdmin() {
        // Create promise
        return (new Promise((resolve, reject) => {
            // Check if enable
            if (!this.__settings.enable) {
                // Send debug message
                this.logger.warn("KafkaAgent.Engine():  Kafka system is not enabled!");
                return resolve(null);
            }

            // Check if already spawn
            if (!(this.__admin)) {
                // Block execution
                return reject(new Error("KafkaAgent<admin> is not spawned!"));
            }

            // Connect producer
            this.__admin.disconnect()
            .then((resClient) => {
                // Clear pointer
                this.__admin = null;

                // Send pointer
                resolve(resClient);
            })
            .catch((err) => {
                // Send debug message
                this.logger.error("KafkaAgent.DisconnectionStatus('admin'):  ERROR  ::-->>  " + JSON.stringify(
                    err, null, 4
                ));

                // Block execution
                reject(err);
            });
        }));
    }

    // --------------------------------------------------------------------- //

    __evt_consumer_listener(event) {
        // Exec based to event type
        switch(event.type) {
            case 'consumer.heartbeat': break;
            case 'consumer.commit_offsets': break;
            case 'consumer.group_join': break;
            case 'consumer.fetch': break;
            case 'consumer.fetch_start': break;
            case 'consumer.start_batch_process': break;
            case 'consumer.end_batch_process': break;
            case 'consumer.connect': break;
            case 'consumer.disconnect': break;
            case 'consumer.stop': break;
            case 'consumer.crash': break;
            case 'consumer.received_unsubscribed_topics': break;
            case 'consumer.network.request': break;
            case 'consumer.network.request_timeout': break;
            case 'consumer.network.request_queue_size': break;

            // DO NOTHING
            default: break;
        }
    }

    __evt_producer_listener(event) {
        // Exec based to event type
        switch(event.type) {
            case 'producer.connect': break;
            case 'producer.disconnect': break;
            case 'producer.network.request': break;
            case 'producer.network.request_timeout': break;
            case 'producer.network.request_queue_size': break;

            // DO NOTHING
            default: break;
        }
    }
}

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: SINGLETON CALL
// ------------------------------------------------------------------------- //

// Create singleton class
class __KafkaAgent_Singleton {
    constructor() {
        // Check for instance
        if (!__KafkaAgent_Singleton.instance) {
            // ... Create new
            __KafkaAgent_Singleton.instance = new __KafkaAgent();
        }
    }

    // Get existing instance
    getInstance() {
        return __KafkaAgent_Singleton.instance;
    }
}

// ------------------------------------------------------------------------- //
//  EXPORT SINGLETON
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     06/04/2021
 * @description: Object with classic and singleton version of kafka.
 */
module.exports = Object.freeze({
    KafkaAgentSingleton: (new __KafkaAgent_Singleton()),
    KafkaAgentClass:     __KafkaAgent
});

// ------------------------------------------------------------------------- //
//  EOF - END OF FILE
// ------------------------------------------------------------------------- //
