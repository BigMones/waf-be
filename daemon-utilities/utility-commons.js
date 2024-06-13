// ------------------------------------------------------------------------- //
//  FORCE STRICT MODE
// ------------------------------------------------------------------------- //

'use strict';

// ------------------------------------------------------------------------- //
//
//  DAEMON UTILITY: COMMONS
//
// ------------------------------------------------------------------------- //

// ------------------------------------------------------------------------- //
//  EXPORT MODULES
// ------------------------------------------------------------------------- //

const moduleObj = Object.freeze({
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Definisce la regex di controllo UUID alle tipologie di assegnamento utente.
     * @type:        Function
     */
    getRegexUUIDv4: (options = {}) => {
        // Prepare base regex
        let tmpRegex = "(^[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}$)";

        // Inject exception string
        if (options &&
            options.plusALL === true) {
            tmpRegex += "|(^ALL$)";
        }

        // Send back as Object
        if (options &&
            options.toRegExp === true) {
            return new RegExp(tmpRegex, "gi");
        }
        // Send back as string
        else return tmpRegex;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Accesso per UUID alle tipologie di assegnamento utente.
     * @type:        Function
     */
    getNullValueUUIDv4: () => {
        return "00000000-0000-0000-0000-000000000000";
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Definisce la regex di controllo Telegram alle tipologie di assegnamento utente.
     * @type:        Function
     */
    getRegexTelegramID: (options = {}) => {
        // Prepare base regex
        let tmpRegex = "(^-[0-9]{13}$)";

        // Send back as Object
        if (options &&
            options.toRegExp === true) {
            return new RegExp(tmpRegex, "g");
        }
        // Send back as string
        else return tmpRegex;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Definisce la regex di controllo msg-history alle tipologie di assegnamento utente.
     * @type:        Function
     */
    getRegexMsgHistoryID: (options = {}) => {
        // Prepare base regex
        let tmpRegex = "(^[0-9]{1,13}#[0-9]{1,5}#[0-9]{1,2}$)|(^[0-9]{1,13}#[0-9]{1,5}#ERR$)";

        // Send back as Object
        if (options &&
            options.toRegExp === true) {
            return new RegExp(tmpRegex, "g");
        }
        // Send back as string
        else return tmpRegex;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Accesso alle librerie google per la formattazione dei numeri.
     * @type:        String
     *
     * @param {String} phoneNumber
     * @param {String} ?defaultRegion
     * @returns: {
     *    "isPossibleNumber":       true,
     *    "isValidNumber":          true,
     *    "isValidNumberForRegion": false,
     *    "isShortNumber":          false,
     *    "isShortNumberForRegion": false,
     *    "getE164ITUFormat":       "+15417543010",
     *    "getRFC3966Format":       "tel:+1-541-754-3010",
     *    "getNationalFormat":      "(541) 754-3010",
     *    "getInternationalFormat": "+1 541-754-3010",
     *    "getRawInput":            "001-541-754-3010",
     *    "getNationalNumber":      5417543010,
     *    "getRegionCodeForNumber": "US",
     *    "getNumberType":          "FIXED_LINE_OR_MOBILE",
     *    "getCountryCodeSource":   "UNSPECIFIED",
     *    "getCountryCode":         1,
     *    "getItalianLeadingZero":  false,
     *    "getExtension":           false
     * }
     */
    resolvePhoneNumber: (phoneNumber, defaultRegion = null) => {
        // Require `PhoneNumberFormat`.
        const PNF = require('google-libphonenumber').PhoneNumberFormat;

        // Require `PhoneNumberFormat`.
        const PNT = require('google-libphonenumber').PhoneNumberType;

        // Require `PhoneNumberFormat`.
        const PNU = require('google-libphonenumber').PhoneNumberUtil;

        // Get an instance of `ShortNumberInfo`.
        const shortInfo = require('google-libphonenumber').ShortNumberInfo.getInstance();

        // Get an instance of `PhoneNumberUtil`.
        const phoneUtil = PNU.getInstance();

        // Parse number with country code and keep raw input.
        const number = phoneUtil.parseAndKeepRawInput(
            phoneNumber,
            defaultRegion
        );

        // Print the phone's country code.
        const _getCountryCode = number.getCountryCode();
        // => 1

        // Print the phone's national number.
        const _getNationalNumber = number.getNationalNumber();
        // => 2024561414

        // Print the phone's extension.
        const _getExtension = number.getExtension();
        // =>

        // Print the phone's italian leading zero.
        const _getItalianLeadingZero = number.getItalianLeadingZero();
        // => false

        // Print the phone's raw input.
        const _getRawInput = number.getRawInput();
        // => 202-456-1414

        // Result from isPossibleNumber().
        const _isPossibleNumber = phoneUtil.isPossibleNumber(number);
        // => true

        // Result from isValidNumber().
        const _isValidNumber = phoneUtil.isValidNumber(number);
        // => true

        // Result from isValidNumberForRegion().
        const _isValidNumberForRegion = phoneUtil.isValidNumberForRegion(number, defaultRegion);
        // => true

        // Result from isPossibleShortNumber().
        const _isShortNumber = shortInfo.isPossibleShortNumber(number);
        // => true

        // Result from isPossibleShortNumberForRegion().
        const _isShortNumberForRegion = shortInfo.isPossibleShortNumberForRegion(number, defaultRegion);
        // => true

        // Result from getRegionCodeForNumber().
        const _getRegionCodeForNumber = phoneUtil.getRegionCodeForNumber(number);
        // => US

        // Format number in the E164 format.
        const _formatE164 = phoneUtil.format(number, PNF.E164);
        // => +12024561414

        // Format number in the national format.
        const _formatNATIONAL = phoneUtil.format(number, PNF.NATIONAL);
        // => (202) 456-1414

        // Format number in the international format.
        const _formatINTERNATIONAL = phoneUtil.format(number, PNF.INTERNATIONAL);
        // => +1 202-456-1414

        // Format number in the international format.
        const _formatRFC3966 = phoneUtil.format(number, PNF.RFC3966);

        // Print the phone's extension when compared to i18n.phonenumbers.CountryCodeSource.
        let _getCountryCodeSource = number.getCountryCodeSource();
        // => FROM_DEFAULT_COUNTRY

        // Result from getNumberType() when compared to i18n.phonenumbers.PhoneNumberType.
        let _getNumberType = phoneUtil.getNumberType(number);
        // => FIXED_LINE_OR_MOBILE

        // Normalize phone type
        switch (_getNumberType) {
            case PNT.FIXED_LINE:           _getNumberType = "FIXED_LINE";           break;
            case PNT.MOBILE:               _getNumberType = "MOBILE";               break;
            case PNT.FIXED_LINE_OR_MOBILE: _getNumberType = "FIXED_LINE_OR_MOBILE"; break;
            case PNT.TOLL_FREE:            _getNumberType = "TOLL_FREE";            break;
            case PNT.PREMIUM_RATE:         _getNumberType = "PREMIUM_RATE";         break;
            case PNT.SHARED_COST:          _getNumberType = "SHARED_COST";          break;
            case PNT.VOIP:                 _getNumberType = "VOIP";                 break;
            case PNT.PERSONAL_NUMBER:      _getNumberType = "PERSONAL_NUMBER";      break;
            case PNT.PAGER:                _getNumberType = "PAGER";                break;
            case PNT.UAN:                  _getNumberType = "UAN";                  break;
            case PNT.VOICEMAIL:            _getNumberType = "VOICEMAIL";            break;
            case PNT.UNKNOWN:
            default:                       _getNumberType = "UNKNOWN";              break;
        }

        // Normalize country source
        switch (_getCountryCodeSource) {
            case PNU.FROM_NUMBER_WITH_PLUS_SIGN:    _getCountryCodeSource = "FROM_NUMBER_WITH_PLUS_SIGN";    break;
            case PNU.FROM_NUMBER_WITH_IDD:          _getCountryCodeSource = "FROM_NUMBER_WITH_IDD";          break;
            case PNU.FROM_NUMBER_WITHOUT_PLUS_SIGN: _getCountryCodeSource = "FROM_NUMBER_WITHOUT_PLUS_SIGN"; break;
            case PNU.FROM_DEFAULT_COUNTRY:          _getCountryCodeSource = "FROM_DEFAULT_COUNTRY";          break;
            case PNU.UNSPECIFIED:
            default:                                _getCountryCodeSource = "UNSPECIFIED";                   break;
        }

        // Send back phone object
        return Object.freeze({
            isPossibleNumber:       _isPossibleNumber       ? _isPossibleNumber       : false,
            isValidNumber:          _isValidNumber          ? _isValidNumber          : false,
            isValidNumberForRegion: _isValidNumberForRegion ? _isValidNumberForRegion : false,
            isShortNumber:          _isShortNumber          ? _isShortNumber          : false,
            isShortNumberForRegion: _isShortNumberForRegion ? _isShortNumberForRegion : false,
            getRawInput:            _getRawInput            ? _getRawInput            : phoneNumber,
            getE164ITUFormat:       _formatE164             ? _formatE164             : false,
            getNationalFormat:      _formatNATIONAL         ? _formatNATIONAL         : false,
            getInternationalFormat: _formatINTERNATIONAL    ? _formatINTERNATIONAL    : false,
            getRFC3966Format:       _formatRFC3966          ? _formatRFC3966          : false,
            getCountryCode:         _getCountryCode         ? _getCountryCode         : false,
            getNationalNumber:      _getNationalNumber      ? _getNationalNumber      : false,
            getExtension:           _getExtension           ? _getExtension           : false,
            getCountryCodeSource:   _getCountryCodeSource   ? _getCountryCodeSource   : false,
            getItalianLeadingZero:  _getItalianLeadingZero  ? _getItalianLeadingZero  : false,
            getRegionCodeForNumber: _getRegionCodeForNumber ? _getRegionCodeForNumber : false,
            getNumberType:          _getNumberType          ? _getNumberType          : false,
        });
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Ritorna la tipologia basata sul prototype.
     * @type:        Sync Function
     *
     * @param {Object} obj
     * @returns String
     */
    typeOfObject: (obj) => {
        // Extract type from prototype
        return Object.prototype.toString.call(obj).match(/\s\w+/)[0].trim();
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Ritorna un testo HTML in PlainText.
     * @type:        Sync Function
     *
     * @param {String} htmlText
     * @returns String
     */
    getPlainTextFromHTML: function (htmlText) {
        if (htmlText && htmlText.trim() != "") {
            return htmlText.replace(/<[^>]+>/g, '').trim();
        }
        else {
            return "";
        }
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Controlla che sia un UUID v4 valido
     * @type:        Sync Function
     *
     * @param {String} uuid
     * @returns Boolean
     */
    isUUIDv4: function (uuid) {
        let uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(uuid);
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Controlla se un oggetto è null o meno
     * @type:        Sync Function
     *
     * @param {Object} obj
     * @returns Boolean
     */
    isNullOrUndefined: function (obj) {
        return (obj == undefined || obj == null);
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Restituisce il nome associato al valore di un enum
     * @type:        Sync Function
     *
     * @param {Object} enumObj
     * @param {Any} value
     * @param {Boolean} isToLower [false]
     * @returns Any
     */
    getEnumKName: function (enumObj, value, isToLower = false) {
        let tmpData = Object.keys(enumObj).find(k => enumObj[k] === value);
        return tmpData ? (isToLower ? tmpData.toLowerCase() : tmpData) : null;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Ritorna il testo tagliato, al primo spazio, se superiore a tot caratteri.
     * @type:        Sync Function
     *
     * @param {String} msg
     * @param {Number} pos
     * @returns String
     */
    cropTextAtPosition: (msg, pos) => {
        // Prepare data
        let msgData = msg.trim();

        // Check message
        if (msgData.length <= pos) return msgData;
        else {
            // Find first space position after CAP (pos)
            let searchIndex = msgData.substring(pos, msgData.length).indexOf(' ');
            let msgCropped  = msgData.substr(0, (pos + searchIndex)).concat(" ...");

            // Return message
            return (searchIndex >= 0 && (pos + searchIndex) < msgData.length) ? msgCropped : msgData;
        }
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Ritorna il testo sanitizzato per uso SLUG.
     * @type:        Sync Function
     *
     * @param {String} s
     * @param {Object} opt [{}]
     * @returns String
     */
    sanitizeText: (s, opt = {}) => {
        // Prepare data
        s   = String(s);
        opt = Object(opt);

        // Default options
        let defaults = {
            'delimiter':     '-',
            'limit':         undefined,
            'lowercase':     true,
            'replacements':  {},
            'transliterate': (typeof (XRegExp) === 'undefined') ? true : false
        };

        // Merge options
        for (let k in defaults) {
            if (!Object.prototype.hasOwnProperty.call(opt, k)) {
                opt[k] = defaults[k];
            }
        }

        // Char map
        let char_map = {
            // Latin
            'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç': 'C',
            'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
            'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ő': 'O',
            'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH',
            'ß': 'ss',
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o',
            'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th',
            'ÿ': 'y',

            // Latin symbols
            '©': '(c)',

            // Greek
            'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '8',
            'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': '3', 'Ο': 'O', 'Π': 'P',
            'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',
            'Ά': 'A', 'Έ': 'E', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I',
            'Ϋ': 'Y',
            'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
            'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
            'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
            'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
            'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',

            // Turkish
            'Ş': 'S', 'İ': 'I', 'Ç': 'C', 'Ü': 'U', 'Ö': 'O', 'Ğ': 'G',
            'ş': 's', 'ı': 'i', 'ç': 'c', 'ü': 'u', 'ö': 'o', 'ğ': 'g',

            // Russian
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
            'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
            'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C',
            'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
            'Я': 'Ya',
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
            'я': 'ya',

            // Ukrainian
            'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
            'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',

            // Czech
            'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U',
            'Ž': 'Z',
            'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u',
            'ž': 'z',

            // Polish
            'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L', 'Ń': 'N', 'Ó': 'o', 'Ś': 'S', 'Ź': 'Z',
            'Ż': 'Z',
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z',
            'ż': 'z',

            // Latvian
            'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i', 'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N',
            'Š': 'S', 'Ū': 'u', 'Ž': 'Z',
            'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n',
            'š': 's', 'ū': 'u', 'ž': 'z'
        };

        // Make custom replacements
        for (let k in opt.replacements) {
            s = s.replace(RegExp(k, 'g'), opt.replacements[k]);
        }

        // Transliterate characters to ASCII
        if (opt.transliterate) {
            for (let k in char_map) {
                s = s.replace(RegExp(k, 'g'), char_map[k]);
            }
        }

        // Replace non-alphanumeric characters with our delimiter
        let alnum = (typeof (XRegExp) === 'undefined') ? RegExp('[^a-z0-9]+', 'ig') : XRegExp('[^\\p{L}\\p{N}]+', 'ig');
        s = s.replace(alnum, opt.delimiter);

        // Remove duplicate delimiters
        s = s.replace(RegExp('[' + opt.delimiter + ']{2,}', 'g'), opt.delimiter);

        // Truncate slug to max. characters
        s = s.substring(0, opt.limit);

        // Remove delimiter from ends
        s = s.replace(RegExp('(^' + opt.delimiter + '|' + opt.delimiter + '$)', 'g'), '');

        // Return slug
        return opt.lowercase ? s.toLowerCase() : s;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Esegue l'escape del testo per singoli e doppi apici
     * @type:        Sync Function
     *
     * @param {String} message
     * @returns String
     */
    textEscape: function (message) {
        // Check type
        if (typeof message === "string") {
            // prepare data
            let tmp = message;

            // Replace invalid chars
            tmp = tmp.replace(/'/g, "&#039;");
            tmp = tmp.replace(/"/g, "&quot;");

            // Send modified
            return tmp;
        }
        // Return as-is
        else return message;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Esegue l'unescape del testo per singoli e doppi apici
     * @type:        Sync Function
     *
     * @param {String} message
     * @returns String
     */
    textUnescape: function (message) {
        // Check type
        if (typeof message === "string") {
            // Prepare data
            let tmp = message;

            // Replace original chars
            tmp = tmp.replace(/&#039;/g, "'");
            tmp = tmp.replace(/&quot;/g, "\"");

            // Send modified
            return tmp;
        }
        // Return as-is
        else return message;
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Sposta un elemento all'interno dell'array
     * @type:        Sync Function
     *
     * @param {Array} array
     * @param {Number} from
     * @param {Number} to
     * @returns Array
     */
    arrayMove: function (array, from, to) {
        let __arrayMove = (__x, __from, __to) => {
            return __x.splice(
                (__to < 0 ? (__x.length + __to) : __to),
                0,
                __x.splice(__from, 1)[0]
            );
        };

        let tmpx = array.slice();
        return __arrayMove(tmpx, from, to);
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Converte la data da millisecondi a stringa human-readable
     * @type:        Sync Function
     *
     * @param {Number} dateMilli
     * @param {Object} options
     * @returns String
     */
    toLocalDate: function (dateMilli, locale = 'en-GB', options = null) {
        // Conversion...
        return (
            // Create date object
            new Date(dateMilli)
        )
        // Convert based to locale and options
        .toLocaleString(
            locale,
            options
        );
    },
    /**
     * @author:      mmarella
     * @version:     18/01/2021 (dd/mm/yyyy)
     * @description: Verifica se è un JSON.
     * @type:        Sync Function
     *
     * @param {String} item
     * @returns Boolean
     */
    isJSON: function (item) {
        // Normalize item to string if already object
        item = typeof item !== "string"
            ? JSON.stringify(item)
            : item;

        // Check conversion
        try {
            // Convert to object
            item = JSON.parse(item);
        }
        catch (e) {
            // Not parsable
            return false;
        }

        // Check for not empty or not undefined object
        if (typeof item === "object" &&
            item !== null            &&
            item !== undefined) {
            // Is parsable
            return true;
        }

        // Always false
        return false;
    },
    /**
     * @author:      mmarella
     * @version:     15/05/2020 (dd/mm/yyyy)
     * @description: Esegue l'intersect dei dati.
     * @type:        String
     */
    arrayIntersect: (arr1, arr2) => {
        // Check arr1
        if (!(Array.isArray(arr1) &&
            arr1.length > 0)) {
            // Always empty
            return [];
        }

        // Check arr2
        if (!(Array.isArray(arr2) &&
            arr2.length > 0)) {
            // Always empty
            return [];
        }

        // Check for intersect data
        arr1 = arr1.map((x) => {
            // Check element
            if (arr2.includes(x.trim())) {
                return x.trim();
            }
            // Send null
            else return null;
        });

        // Remove null value
        return arr1.filter(x => x);
    },
});

// Public scope
module.exports = moduleObj;

// ------------------------------------------------------------------------- //
//  END: UTILITY
// ------------------------------------------------------------------------- //

/* eslint no-dupe-keys: off */
/* eslint no-undef: off */
