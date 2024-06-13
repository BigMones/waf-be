// ------------------------------------------------------------------------- //
//
//  DAEMON UTILITY: SQL
//
// ------------------------------------------------------------------------- //
//  COMMON ENUMS
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

const moduleObj = Object.freeze({
    /**
     * @author:      mmarella
     * @version:     26/03/2021 (dd/mm/yyyy)
     * @description: Gestione della paginazione nelle query.
     * @type:        Sync Function
     *
     * @param {String} sqlStatement
     * @param {Object} pageOptions
     * @returns String
     */
    injectPagination: function (sqlStatement, pageOptions) {
        // Check
        if (!(sqlStatement.length > 0 &&
            pageOptions               &&
            pageOptions.limit != null &&
            pageOptions.page != null  &&
            pageOptions.limit > 0     &&
            pageOptions.page >= 0)) {
            // Return statement as-is
            return sqlStatement;
        }

        // Check for query end char...
        if (sqlStatement.endsWith(";")) {
            // Normalize statement for injection
            sqlStatement = sqlStatement.substr(
                0,
                sqlStatement.length - 2
            );
        }

        // Extract data from options
        const sqlPageLimit  = Math.round(pageOptions.limit);
        const sqlPageNumber = Math.round(pageOptions.page);

        // Calc offset from limit and current page
        const sqlPageOffset = (pageOptions.page > 1) ?
            ((sqlPageNumber - 1) * sqlPageLimit)
            : 0;

        // Inject page logic and return
        return `
            WITH ctxquery AS (
                ` + sqlStatement + `
            )
            SELECT
                c.paginator_t_res,
                CASE
                    WHEN EXISTS(
                        SELECT *
                        FROM ctxquery
                        LIMIT ` + sqlPageLimit + `
                        OFFSET ` + sqlPageOffset + `
                    )
                    THEN TRUE
                    ELSE FALSE
                END AS paginator_t_flag,
                subquery.*
            FROM (
                ` + sqlStatement + `
                LIMIT ` + sqlPageLimit + `
                OFFSET ` + sqlPageOffset + `
            ) AS subquery
            RIGHT JOIN (
                SELECT COUNT(*) AS paginator_t_res
                FROM ctxquery
            ) AS c ON TRUE;
        `;
    },
    /**
     * @author:      mmarella
     * @version:     26/03/2021 (dd/mm/yyyy)
     * @description: Estrazione dai parametri dei valori di paginazione.
     * @type:        Sync Function
     *
     * @param {Object} params
     * @returns Object Paginator
     */
    extractPaginator: function (params) {
        // Prepare default paginator
        let paginatorObj = {
            limit: 0,
            page:  0
        };

        // Check for 'limit' property
        if (params               &&
            params.limit != null &&
            params.limit > 0) {
            // Save new value from params
            paginatorObj.limit = parseInt(params.limit, 10);
        }

        // Check for 'page' property
        if (params              &&
            params.page != null &&
            params.page >= 0) {
            // Save new value from params
            paginatorObj.page = parseInt(params.page, 10);
        }

        // Return paginator structure
        return paginatorObj;
    },
    /**
     * @author:      mmarella
     * @version:     26/03/2021 (dd/mm/yyyy)
     * @description: Estrazione, se presente, del numero totale di risultati
     * @type:        Sync Function
     *
     * @param {Array} rows
     * @param {Number} rowCount
     * @param {String} message
     * @returns Object {rows rowCount, errnmsg}
     */
    normalizePaginatorResults: function (rows, rowCount, message) {
        // Check for '0'.'paginator_t_res' property
        if (rows                                  &&
            Array.isArray(rows)                   &&
            rows.length > 0                       &&
            rows[0].paginator_t_res != null       &&
            rows[0].paginator_t_res != undefined  &&
            rows[0].paginator_t_flag != null      &&
            rows[0].paginator_t_flag != undefined) {
            try {
                // Save and convert count from first row
                rowCount = parseInt(
                    rows[0].paginator_t_res,
                    10
                );

                // Check for null results
                if (!rows[0].paginator_t_flag) {
                    // Reset data and message
                    rows    = [];
                    message = "The requested resource could not be found!";
                }
            }
            // Catch error and reset to default if set
            catch (err) {
                // Reset all on error
                rowCount = -1;
                message  = err.message;
                rows     = [];
            }
        }

        // Return triple-response structure
        return {
            "rows":     rows,
            "rowCount": rowCount,
            "errnmsg":  message
        };
    }
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: UTILITY
// ------------------------------------------------------------------------- //
