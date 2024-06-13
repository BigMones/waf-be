// ------------------------------------------------------------------------- //
//
//  CORE MODULE: MARIA-MYSQL-DATABASE
//
// ------------------------------------------------------------------------- //
//  CONFIGURATION BLOCK FOR INI FILE
// ------------------------------------------------------------------------- //
//
//      [database]
//      mariadb-compress-enable = "off"
//      mariadb-host            = "127.0.0.1"
//      mariadb-port            = "3306"
//      mariadb-user            = "root"
//      mariadb-pswd            = "root"
//      mariadb-dbname          = "my_db_name"
//      mariadb-conn-limit      = 10
//      mariadb-conn-timeout    = "0s"
//
// ------------------------------------------------------------------------- //
//  ESLINT CONFIGURATION
// ------------------------------------------------------------------------- //

/* eslint-disable no-empty */

// ------------------------------------------------------------------------- //
//  COMMON MODULES
// ------------------------------------------------------------------------- //

// Load module for database
const mariadb = require('mariadb');

// ------------------------------------------------------------------------- //
//  COMMON DATA
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: BASE CALL
// ------------------------------------------------------------------------- //

// Create base class: PG-LINK
class __MariaDatabase {
    constructor() {
        // -------------------------------------------------------------------|
        //  PREPARE POOL
        // -------------------------------------------------------------------|

        // Create id
        this.instanceId = "db-pool-" + Date.now();

        // -------------------------------------------------------------------|
        //  PREPARE POOL
        // -------------------------------------------------------------------|

        // Save default values
        this.__pool = null;

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

    // Init all db system
    init(p_configs = {}, p_logger = {}) {
        // -------------------------------------------------------------------|
        //  PREPARE SETTINGS
        // -------------------------------------------------------------------|

        // Save default settings
        let __settings = {
            compress:                false,
            user:                    null,
            password:                null,
            database:                null,
            host:                    'localhost',
            port:                    3306,
            connectionLimit:         10,
            connectionTimeoutMillis: 0
        };

        // -------------------------------------------------------------------|
        //  MERGE SETTINGS
        // -------------------------------------------------------------------|

        // Save new settings
        __settings = {
            ...__settings,
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

        // -------------------------------------------------------------------|
        //  SPAWN POOL INSTANCE
        // -------------------------------------------------------------------|

        // Prepare instance
        this.__pool = mariadb.createPool({
            compress:          __settings.compress,
            user:              __settings.user,
            password:          __settings.password,
            database:          __settings.database,
            host:              __settings.host,
            port:              parseInt(__settings.port, 10),
            connectionLimit:   parseInt(__settings.connectionLimit, 10),
            connectTimeout:    parseInt(__settings.connectionTimeoutMillis, 10),
            // Return result-sets as array, rather than a JSON object!!!
            rowsAsArray:       false,
            namedPlaceholders: true
        });

        // -------------------------------------------------------------------|
        //  SPAWN POOL EVENTS
        // -------------------------------------------------------------------|

        // Register all pool events
        this.__pool.on('acquire', (client) => {
            // Send debug message
            this.logger.info("DbConnection.ClientAcquired():  " + client.processID);
        });

        // Register all pool events
        this.__pool.on('release', (client) => {
            // Send debug message
            this.logger.info("DbConnection.ClientRemoved():  " + client.processID);
        });

        // Register all pool events
        this.__pool.on('error', (err, client) => {
            // Send debug message
            this.logger.error(
                "DbConnection.ThrowError(CLIENT<" + client.processID + ">):  " +
                JSON.stringify(err, null, 4)
            );
        });

        // Create chain
        return this;
    }

    // Get pointer to pool connection
    db() {
        // Check if exists
        if (this.__pool) {
            // Send pointer
            return this.__pool;
        }
        // Rise error
        else throw new Error(
            "Uninitialized DB-Pool: Try to call instance.init({...}) first."
        );
    }
}

// ------------------------------------------------------------------------- //
//  CREATE CLASSES: SINGLETON CALL
// ------------------------------------------------------------------------- //

// Create singleton class: PG-LINK
class __MariaDatabase_Singleton {
    constructor() {
        // Check for instance
        if (!__MariaDatabase_Singleton.instance) {
            // ... Create new
            __MariaDatabase_Singleton.instance = new __MariaDatabase();
        }
    }

    // Get existing instance
    getInstance() {
        return __MariaDatabase_Singleton.instance;
    }
}

// ------------------------------------------------------------------------- //
//  EXPORT SINGLETON
// ------------------------------------------------------------------------- //

/**
 * @author:      mmarella
 * @version:     05/05/2020
 * @description: Object with classic and singleton version of DB and IPC.
 */
module.exports = Object.freeze({
    DbSingleton:  (new __MariaDatabase_Singleton()),
    DbClass:      __MariaDatabase
});

// ------------------------------------------------------------------------- //
//  EOF - END OF FILE
// ------------------------------------------------------------------------- //
