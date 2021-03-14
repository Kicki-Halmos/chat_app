const express = require('express')
const app = require('express')()

const getUsers = (users) => {
api_users = JSON.stringify(users)
return api_users
}

module.exports = getUsers