const loadUser = () => {
    fetch('/dashboard')
        .then(res => res.json()) 
        .then(users => {
            for(user of users) {
            let item = document.createElement('li')
            item.textContent = user.name;
            let item_user = document.getElementById('online_users')
            item_user.appendChild(item);
            
            }
        })
}

loadUser()