export async function loginFetch (user) {
    let data = new FormData()
    data.append("username", user.username.toLowerCase())
    data.append("password", user.password)
    let response = await fetch('/login', {method: 'POST', body: data})
    let body = await response.text()
    let parsed = JSON.parse(body)
    if (parsed.success) {
        return parsed.user
    } else{
        return false
    }
}
