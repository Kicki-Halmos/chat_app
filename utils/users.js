let users = []

function userJoin(socketId, id, username){
    const user = {
        socketId,
        id,
        username
    }

    users.push(user);
    return users
}

function getCurrentuser(id){
    return users.find(user => user.id === id)
}  

function userLeave(id) {

    //console.log('i userleave id ' + id)
    //console.log('hej')
    //console.log(users)
 
   users = users.filter(user => user.socketId !== id);
   //console.log('hå')
   //console.log(users)
   return users
} 


module.exports = {userJoin, getCurrentuser, userLeave}