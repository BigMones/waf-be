// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';
(async () => {

// ------------------------------------------------------------------------- //
//
//  ENTRYPOINT: DAEMON RESTful WEB-SERVICE
//
// ------------------------------------------------------------------------- //
//  WARNING MESSAGE
// ------------------------------------------------------------------------- //

    // Spawn space on logs between two instances
    console.log("\n \n \n \n |-->>  START PROCESS (" + process.pid + ") <<--| \n \n \n  \n ");

// ------------------------------------------------------------------------- //
//  INIT OS MODULES
// ------------------------------------------------------------------------- //

    // Load OS modules
    const ms = require("ms");

// ------------------------------------------------------------------------- //
//  INIT SETTINGS AND CLASS-HELPER
// ------------------------------------------------------------------------- //

    // Load module for settings
    const { SettingsMngSingleton } = require('./daemon-kernels/kernel-settings');

    // Get instance of settings
    const dataConfigs = SettingsMngSingleton.getInstance();

    // Init settings manager
    dataConfigs.init(
        process.cwd() + '/daemon-settings.ini',
        process.cwd() + '/daemon-env-mapper.json'
    );

// ------------------------------------------------------------------------- //
//  INIT NETWORK FRAMEWORK
// ------------------------------------------------------------------------- //

    // Setting-up network framework
    const fastify = require('fastify')({
        https: dataConfigs.getAsBoolean("server-http-secure", "server-ssl-enable") ? {
            allowHTTP1: dataConfigs.getAsBoolean("server-http-secure", "server-ssl-http1"),
            key:        dataConfigs.getProperty("server-http-secure", "server-ssl-cert"),
            cert:       dataConfigs.getProperty("server-http-secure", "server-ssl-key")
        } : false,
        bodyLimit: 52428800,
        logger: dataConfigs.getAsBoolean("log-system", "log-sys-enable") ? {
            level: dataConfigs.getProperty("log-system", "log-sys-level"),
            redact: [
                'req.headers.authorization'
            ],
            serializers: {
                req(req) {
                    return {
                        method:        req.method,
                        url:           req.url,
                        headers:       req.headers,
                        hostname:      req.hostname,
                        remoteAddress: req.ip,
                        remotePort:    req.connection.remotePort
                    }
                }
            },
            prettyPrint: {
                colorize:               true,               // --colorize
                crlf:                   false,              // --crlf
                errorLikeObjectKeys:    ['err', 'error'],   // --errorLikeObjectKeys
                errorProps:             '',                 // --errorProps
                levelFirst:             true,               // --levelFirst
                messageKey:             'msg',              // --messageKey
                messageFormat:          false,              // --messageFormat
                timestampKey:           'time',             // --timestampKey
                translateTime:          true,               // --translateTime
                ignore:                 'v'                 // --ignore
            }
        } : false,
        ignoreTrailingSlash: true
    });

    // Set logger as global variable
    global.logger = fastify.log;

    // Show startup header
    logger.info("------------------------------------------------------------------------");
    logger.info("-- DAEMON PLATFORM - CORE INITIALIZATION                              --");
    logger.info("------------------------------------------------------------------------");

    // Debug message info
    logger.info("Platform.Init-System():  Registering setting components...");

    // Create new decorators
    fastify.decorate("getConfigs", () => { return dataConfigs; });
    fastify.decorateRequest("getConfigs", () => { return dataConfigs; });

// ------------------------------------------------------------------------- //
//  PROCESS HANDLERS -> CALLBACKS
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering signal components...");

    let __onSignals_Handler = (signal) => {
        // Send to log system
        logger.info("Platform.ProcessProc():  Exit.Signal()  ::-->>  " + signal);

        // Force kill
        process.exit(0);
    };

    let __onExit_Handler = (code) => {
        // Send to log system
        logger.info("Platform.ProcessProc():  Exit.Code()  ::-->>  " + code);

        // Force kill
        process.exit(0);
    };

    let __onRejection_Handler = (reason) => {
        // Send to log system
        logger.error("Platform.ProcessErrn():  Rejection.At()  ::-->>  ");
        console.error(reason);

        // Force kill
        process.exit(0);
    };

    let __onException_Handler = (err) => {
        // Send to log system
        logger.error(new Error("Platform.ProcessErrn():  PM.Send()  ::-->>  ").message);
        console.error(err);

        // Force kill
        process.exit(0);
    };

// ------------------------------------------------------------------------- //
//  PROCESS HANDLERS
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering handler components...");

    // App is closing
    process.on('exit', __onExit_Handler);

    // Catches ctrl+c event
    process.on('SIGINT', __onSignals_Handler);

    // Catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', __onSignals_Handler);
    process.on('SIGUSR2', __onSignals_Handler);

    // Catches unhandled rejection/exception
    process.on('unhandledRejection', __onRejection_Handler);
    process.on('uncaughtException',  __onException_Handler);

// ------------------------------------------------------------------------- //
//  HANDLER FAVICON
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering favicon components...");

    // Install handler for favicon
    fastify.register(require('fastify-favicon'), {
        path: "./daemon-assets/"
    });

// ------------------------------------------------------------------------- //
//  INIT NETWORK MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering firewall components...");

    // Wrapper fastify for HELMET,
    // full options: https://www.npmjs.com/package/helmet
    fastify.register(require('fastify-helmet'), {
        contentSecurityPolicy: false,
        // Other options for:
        //      helmet.contentSecurityPolicy
        //      helmet.dnsPrefetchControl
        //      helmet.expectCt
        //      helmet.frameguard
        //      helmet.hidePoweredBy
        //      helmet.hsts
        //      helmet.ieNoOpen
        //      helmet.noSniff
        //      helmet.permittedCrossDomainPolicies
        //      helmet.referrerPolicy
        //      helmet.xssFilter
        // must added here...
    });

    // Loading message info
    logger.info("Platform.Init-System():  Registering cors components...");

    // Wrapper fastify for CORS
    // full options: https://www.npmjs.com/package/fastify-cors
    fastify.register(require('fastify-cors'), {
        origin:      true,
        credentials: true
    });

    // Loading message info
    logger.info("Platform.Init-System():  Registering url-editor components...");

    // URL module
    fastify.register(require('fastify-url-data'));

    // Loading message info
    logger.info("Platform.Init-System():  Registering form-type components...");

    // Form modules
    fastify.register(require('fastify-formbody'));
    fastify.register(require('fastify-file-upload'), {
        limits: {
            parseNested:   true,
            fieldNameSize: dataConfigs.getProperty("server-upload", "server-field-name-size"), // Max field name size in bytes
            fieldSize:     dataConfigs.getProperty("server-upload", "server-field-size"),      // Max field value size in bytes
            fields:        dataConfigs.getProperty("server-upload", "server-fields"),          // Max number of non-file fields
            fileSize:      dataConfigs.getProperty("server-upload", "server-file-size"),       // For multipart forms, the max size
            files:         dataConfigs.getProperty("server-upload", "server-files"),           // Max number of file fields
            headerPairs:   dataConfigs.getProperty("server-upload", "server-header-pairs")     // Max number of header key=>value
        }
    });

// ------------------------------------------------------------------------- //
//  INIT SECURITY MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering policy components...");

    const banValue = dataConfigs.getProperty("server-security", "call-rate-ban");

    // Add rest rate limiter
    fastify.register(require('fastify-rate-limit'), {
        global:      dataConfigs.getAsBoolean("server-security", "call-rate-enable"),    // Default:  true
        ban:         (banValue > 0) ? banValue : null,                                   // Default:  null
        max:         () => {
            return dataConfigs.getProperty("server-security", "call-rate-max");          // Default:  1000
        },
        timeWindow:  ms(dataConfigs.getProperty("server-security", "call-rate-window")), // Default:  1000 * 60
        cache:       0,                                                                  // Default:  5000
        whitelist:   dataConfigs.getProperty("server-security", "call-rate-whitelist"),  // Default:  []
        skipOnError: true,                                                               // Default:  false
        addHeaders: {
            'x-ratelimit-limit':     true,
            'x-ratelimit-remaining': true,
            'x-ratelimit-reset':     true,
            'retry-after':           true
        }
    });

// ------------------------------------------------------------------------- //
//  INIT GZIP/ZLIB COMPRESSION COMPONENT
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering compression components...");

    // Enable software gzip for output
    fastify.register(require('fastify-compress'), {
        global:    dataConfigs.getAsBoolean("server-compression", "server-gzip"),
        threshold: dataConfigs.getProperty("server-compression",  "server-threshold"),
        encodings: dataConfigs.getProperty("server-compression",  "server-encodings")
    });

// ------------------------------------------------------------------------- //
//  INIT SWAGGER MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering swagger components...");

    // Inject swagger wrapper
    fastify.register(require('fastify-oas'), {
        routePrefix: dataConfigs.getProperty("swagger",  "swagger-http-path"),
        exposeRoute: dataConfigs.getAsBoolean("swagger", "swagger-enable"),
        addModels:   dataConfigs.getAsBoolean("swagger", "swagger-models"),
        swagger: {
            info: {
                title:       dataConfigs.getProperty("swagger", "swagger-title"),
                description: dataConfigs.getProperty("swagger", "swagger-description"),
                version:     dataConfigs.getProperty("swagger", "swagger-api-version")
            },
            host:     dataConfigs.getProperty("swagger", "swagger-hostname"),
            schemes:  dataConfigs.getProperty("swagger", "swagger-schemes"),
            consumes: ['application/json'],
            produces: ['application/json'],
            tags:     require("./daemon-schemes/schema-tags")(),
            securityDefinitions: {
                "bearer_jwt_token": {
                    "type":         "http",
                    "scheme":       "bearer",
                    "bearerFormat": "JWT"
                }
            }
        }
    });

    // Check if enabled from config file
    if (dataConfigs.getAsBoolean("swagger-stats", "swagger-stats-enable")) {
        // Loading message info
        logger.info("Platform.Init-System():  Registering swagger-stats components...");

        // Inject plugin
        fastify.register(
            require('swagger-stats').getFastifyPlugin,
            {
                swaggerSpec: dataConfigs.getProperty("swagger", "swagger-hostname") +
                             dataConfigs.getProperty("swagger", "swagger-http-path")
            }
        );
    }

// ------------------------------------------------------------------------- //
//  INIT DATABASE MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering database components...");

    // Load module for database
    const { DbSingleton } = require('./daemon-kernels/kernel-database');

    // Prepare db options
    const DB_USER   = dataConfigs.getProperty("database",    "mariadb-user");
    const DB_PSWD   = dataConfigs.getProperty("database",    "mariadb-pswd");
    const DB_HOST   = dataConfigs.getProperty("database",    "mariadb-host");
    const DB_PORT   = dataConfigs.getProperty("database",    "mariadb-port");
    const DB_NAME   = dataConfigs.getProperty("database",    "mariadb-dbname");
    const DB_GZIP   = dataConfigs.getAsBoolean("database",   "mariadb-compress-enable");

    // Create instance
    const mariaPool = DbSingleton.getInstance();

    // Init settings
    mariaPool.init(
        // Connection pool settings
        {
            compress:                DB_GZIP,
            user:                    DB_USER,
            password:                DB_PSWD,
            host:                    DB_HOST,
            port:                    DB_PORT,
            database:                DB_NAME,
            connectionLimit:         dataConfigs.getProperty("database", "mariadb-conn-limit"),
            connectionTimeoutMillis: ms(dataConfigs.getProperty("database", "mariadb-conn-timeout"))
        },
        // Logger custom function
        {
            info:  () => null,
            warn:  () => null,
            error: () => null
        }
    );

    // Create new decorators
    fastify.decorate("getDatabase", () => { return DbSingleton.getInstance().db(); });
    fastify.decorateRequest("getDatabase", () => { return DbSingleton.getInstance().db(); });



// ------------------------------------------------------------------------- //
//  INIT ELASTICSEARCH MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering elasticsearch components...");

    // Load module for database
    const { ElasticSearchSingleton } = require('./daemon-kernels/kernel-elasticsearch');

    // Create instance
    const elkPool = ElasticSearchSingleton.getInstance();

    // Get temp. settings
    const ELK_PROXY_ENABLE = dataConfigs.getAsBoolean("elk-system", "elk-sys-proxy-enable");
    const ELK_GZIP_ENABLE  = dataConfigs.getAsBoolean("elk-system", "elk-sys-compression-enable");

    // Create settings from temp.
    const ELK_PROXY_PATH = ELK_PROXY_ENABLE ? dataConfigs.getProperty("elk-system", "elk-sys-proxy-path") : null;

    // Init settings
    elkPool.init(
        // Connection pool settings
        {
            enable:             dataConfigs.getAsBoolean("elk-system",   "elk-sys-enable"),
            node:               dataConfigs.getProperty("elk-system",    "elk-sys-remote-node"),
            proxy:              ELK_PROXY_PATH,
            maxRetries:         dataConfigs.getProperty("elk-system",    "elk-sys-remote-retries"),
            requestTimeout:     ms(dataConfigs.getProperty("elk-system", "elk-sys-request-timeout")),
            pingTimeout:        ms(dataConfigs.getProperty("elk-system", "elk-sys-ping-timeout")),
            resurrectStrategy:  dataConfigs.getProperty("elk-system",    "elk-sys-resurrect-strategy"),
            suggestCompression: ELK_GZIP_ENABLE,
            compression:        ELK_GZIP_ENABLE ? "gzip" : false,
            sniffOnStart:       dataConfigs.getAsBoolean("elk-system",   "elk-sys-sniff-on-start")
        },
        // Logger custom function
        {
            info:  (msg) => logger.info(msg),
            warn:  (msg) => logger.warn(msg),
            error: (msg) => logger.error(msg)
        }
    );

    // Create new decorators
    fastify.decorate("getElasticSearch", () => { return ElasticSearchSingleton.getInstance(); });
    fastify.decorateRequest("getElasticSearch", () => { return ElasticSearchSingleton.getInstance(); });

// ------------------------------------------------------------------------- //
//  INIT MULTI-VECTOR AUTH
//  Documentation: https://github.com/fastify/fastify-auth
// ------------------------------------------------------------------------- //

    // Debug message info
    logger.info("Platform.Init-System():  Registering authentication components...");

    // Set multi-vector auth
    fastify.register(require('fastify-auth'));

// ------------------------------------------------------------------------- //
//  INIT HOOKS MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering hook components...");

    // Inject all custom decorators
    require('./daemon-kernels/kernel-hooks')(fastify);

// ------------------------------------------------------------------------- //
//  INIT DECORATOR MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering decorator components...");

    // Inject all custom decorators
    require('./daemon-kernels/kernel-decorators')(fastify);

// ------------------------------------------------------------------------- //
//  INIT SOCKET.IO COMPONENT
// ------------------------------------------------------------------------- //

    // Check if ws is enabled
    if (dataConfigs.getAsBoolean("server-websocket", "socket-io-enable")) {
        // Loading message info
        logger.info("Platform.Init-System():  Registering socket.io components...");

        // Enable software socket.io adapter
        // full options: 1# https://www.npmjs.com/package/fastify-socket.io
        //               2# https://socket.io/docs/v3/server-api/index.html
        fastify.register(require('fastify-socket.io'), {
            path:        dataConfigs.getAsBoolean("server-websocket", "socket-io-listen-path"),
            serveClient: dataConfigs.getAsBoolean("server-websocket", "socket-io-cdn-enable")
            // Put your other options here
        });

        // Delegate to kernel engine
        require('./daemon-kernels/kernel-socketio')(fastify);
    }


// ------------------------------------------------------------------------- //
//  INIT SCHEMA MODULES
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering schema components...");

    // Register default schemas
    require("./daemon-schemes/schema-tags")(fastify);
    require("./daemon-schemes/schema-commons")(fastify);

    // ===================================================================== //
    //  START: Custom schemas for project
    // ===================================================================== //
    require("./daemon-schemes/schema-login")(fastify);
    require("./daemon-schemes/schema-poll")(fastify);
    require("./daemon-schemes/schema-team")(fastify);

    // ===================================================================== //
    //  END: Custom schemas for project
    // ===================================================================== //

// ------------------------------------------------------------------------- //
//  INIT ROUTE MODULES
// ------------------------------------------------------------------------- //

    // Load all routes when system ready
    fastify.after(() => {
        // Loading message info
        logger.info("Platform.Init-System():  Starting up all route handlers...");

        // Prepare route loader
        const routeLoader = require("./daemon-kernels/kernel-routes");

        // Check if enabled from config file
        if (dataConfigs.getAsBoolean("server-webui", "server-webui-enable")) {
            // Set graphic welcome page
            fastify.register(require('fastify-static'), {
                prefixAvoidTrailingSlash: true,
                root:     require("path").join(__dirname, 'daemon-www'),
                prefix:   '/*',
                redirect: true,
                wildcard: true
            });

            // Loading message info
            logger.info("Platform.Boot-System():     +--->>  [ROOT]  Found 'web-ui' version of endpoint to spawn!!");
        }
        // Otherwise...
        else {
            // Start default routes
            routeLoader(fastify, "root", "handler-root");
        }

        // ================================================================= //
        //  START: Custom routes for project
        // ================================================================= //
        routeLoader(fastify, "user", "handler-user");
        routeLoader(fastify, "poll", "handler-poll");
        routeLoader(fastify, "team", "handler-team");
  


        // ================================================================= //
        //  END: Custom routes for project
        // ================================================================= //

        // Loading message info
        logger.info("Platform.Init-System():  Starting up all route handlers... COMPLETED!");
    });

// ------------------------------------------------------------------------- //
//  WELCOME HEADER => CONSOLE
// ------------------------------------------------------------------------- //

    // Loading message info
    logger.info("Platform.Init-System():  Registering HTTP listener...");

    // Use port from settings unless there exists a preconfigured port
    let listenHTTP_Port = dataConfigs.getProperty("server", "server-bind-port");

    // Check from process arguments
    if (process.argv[2] == "--port" && process.argv[3] != null) {
        listenHTTP_Port = process.argv[3];
    }

// ------------------------------------------------------------------------- //
//  INIT LISTENER (HTTP, SOCKET.IO) ON PORT...
// ------------------------------------------------------------------------- //

    try {
        // Loading message info
        logger.info("------------------------------------------------------------------------");
        logger.info("-- DAEMON PLATFORM - CORE STARTUP                                     --");
        logger.info("------------------------------------------------------------------------");

        // Check for error when fastify eco-system is ready
        fastify.ready(err => {
            // Check error
            if (err) { throw err; }
        });

        // Spawn HTTP listener on specified IP:PORT
        fastify.listen(
            listenHTTP_Port,
            dataConfigs.getProperty("server", "server-bind-addr"),
            dataConfigs.getProperty("server", "server-tcp-queue"),
            async (err) => {
                // Check error
                if (err) { throw err; }

                // Register swagger listener
                fastify.oas();

                // Get conn from poll
                let __tryConn = await mariaPool.db().getConnection();

                // Prepare statement
                const servDbVer = await __tryConn.serverVersion();

                // Check nullPointerd
                if (__tryConn) {
                    // Release client
                    __tryConn.release();
                }

                // Get encodings
                let zipAlgo = dataConfigs.getProperty("server-compression", "server-encodings");

                // Normalize encodings
                zipAlgo = zipAlgo ? (
                    Array.isArray(zipAlgo) ? zipAlgo.join(", ") : zipAlgo
                ) : "- - -";

                // Check metrics
                let getMetricsURL = (dataConfigs.getAsBoolean("swagger-stats", "swagger-stats-enable")) ? (
                    dataConfigs.getProperty("server", "server-public-proto") +
                    "://" + dataConfigs.getProperty("server", "server-public-host") +
                    ":" + listenHTTP_Port + "/swagger-stats/ux"
                ) : "disabled";

                // Show startup header
                logger.info("------------------------------------------------------------------------");
                logger.info("-- DAEMON PLATFORM - CORE SUMMARIES                                   --");
                logger.info("------------------------------------------------------------------------");
                logger.info("                   :");
                logger.info("       SERVER-NAME :   " + dataConfigs.getProperty("server", "server-name"));
                logger.info("    SERVER-VERSION :   " + dataConfigs.getProperty("server", "server-version"));
                logger.info("      PRIVATE-BIND :   " + dataConfigs.getProperty("server", "server-bind-addr") + ":" + listenHTTP_Port);
                logger.info("       PUBLIC-HOST :   " + dataConfigs.getProperty("server", "server-public-host"));
                logger.info("         TCP-QUEUE :   " + dataConfigs.getProperty("server", "server-tcp-queue"));
                logger.info("                   :");
                logger.info("------------------<:");
                logger.info("                   :");
                logger.info("        DB VERSION :   Maria/MySQL v." + servDbVer);
                logger.info("      DB AUTH@HOST :   " + DB_USER + "@" + DB_HOST + ":" + DB_PORT);
                logger.info("           DB NAME :   " + DB_NAME);
                logger.info("           DB GZIP :   " + (DB_GZIP ? "on" : "off"));
                logger.info("                   :");
                logger.info("------------------<:");
                logger.info("                   :");
                logger.info("         HTTP-GZIP :   " + (dataConfigs.getAsBoolean("server-compression", "server-gzip") ? "on" : "off"));
                logger.info("         ZIP-ALGOS :   " + zipAlgo);
                logger.info("                   :");
                logger.info("------------------<:");
                logger.info("                   :");
                logger.info("         SOCKET.IO :   " + (dataConfigs.getAsBoolean("server-websocket", "socket-io-enable") ? "on" : "off"));
                logger.info("                   :");
                logger.info("------------------<:");
                logger.info("                   :");
                logger.info("    LOGSYS-ENABLED :   " + (dataConfigs.getAsBoolean("log-system", "log-sys-enable") ? "on" : "off"));
                logger.info("      LOGSYS-LEVEL :   " + dataConfigs.getProperty("log-system", "log-sys-level"));
                logger.info("                   :");
                logger.info("------------------<:");
                logger.info("                   :");
                logger.info("       METRICS-API :   " + getMetricsURL);
                logger.info("                   :");

                // Show or Hide routes tree mapping
                if (dataConfigs.getAsBoolean("server", "server-route-map")) {
                    // Show startup header
                    logger.info("------------------------------------------------------------------------");
                    logger.info("-- DAEMON PLATFORM - CORE ENDPOINTS MAP                               --");
                    logger.info("------------------------------------------------------------------------");

                    // Show routes-tree as DEBUG info
                    console.log("\n$");
                    console.log(fastify.printRoutes());
                }

                // Info log on start
                logger.info("------------------------------------------------------------------------");
                logger.info("-- DAEMON PLATFORM - READY FOR REQUESTS                               --");
                logger.info("------------------------------------------------------------------------");
            }
        );
    }
    catch (err) {
        // Log error and force quit
        logger.error(err);
        process.exit(1);
    }

// ------------------------------------------------------------------------- //
//  END: SERVICE
// ------------------------------------------------------------------------- //

})();

// ------------------------------------------------------------------------- //
//  END: TRIGGER
// ------------------------------------------------------------------------- //

/* global logger */
