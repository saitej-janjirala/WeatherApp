// fetch('http://puzzle.mead.io/puzzle').then((response)=>{
//     response.json().then((data)=>{
//         console.log(data)
//     })
// })

// fetch('http://localhost:3000/weather?address=Delhi').then((response) => {
//     response.json().then((data) => {
//         if (data.error) {
//             console.log(data.error)
//         } else {
//             console.log(data)
//         }
//     })
// })
const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
weatherForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const location = search.value
    fetch('/weather?address=' + location).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                document.querySelector("#error").textContent=data.error
                document.querySelector("#temperature").textContent=''
                document.querySelector("#description").textContent=''
                document.querySelector("#pressure").textContent=''
            } else {
                document.querySelector("#error").textContent=''
                document.querySelector("#temperature").textContent=data.temperature+'°C'
                document.querySelector("#description").textContent=data.weather
                document.querySelector("#pressure").textContent="Pressure: "+data.pressure+'p'
            }
        })
    })
})