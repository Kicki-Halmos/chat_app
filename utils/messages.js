const moment = require('moment')

function formatMessage(text,username, profile_pic) {
    return{
        text,
        username,
        profile_pic,
        time: moment().format('YYYY-MM-DD HH:mm')
    }

}

module.exports = formatMessage