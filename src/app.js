const path = require('path')
const express = require('express')
const hbs = require('hbs')
const { response } = require('express')

const app = express()
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')
const viewspath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewspath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'saiteja'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'saiteja'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'saiteja'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'saiteja',
        errorMessage: 'Help Article not found'
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'you have to provide a search term'
        })
    }
    else {
        console.log(req.query)
        res.send({
            products: [

            ]
        })
    }
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'you have to provide the address'
        })
    }
    else {
        geoCode(req.query.address, (error, data) => {
            if (error) {
                console.log(error)
                return res.send({
                    error
                })
            }
            else {
                getWeatherInfo(data, (error, { weather_descriptions, precip, pressure, temperature } = {}) => {
                    if (error) {
                        console.log(error)
                        return res.send({
                            error
                        })
                    }
                    else {
                        res.send({
                            weather: weather_descriptions[0],
                            precip: precip,
                            pressure: pressure,
                            temperature: temperature
                        })
                    }
                })
            }
        })
    }
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Created by saiteja',
        errorMessage: 'Page Not Found'
    })
})


// app.get('', (request, response) => {
//     response.send('hello express')
// })

// app.get('/saiteja', (request, response) => {
//     response.send('hey this is saiteja')
// })

// app.get('/basic', (request, response) => {
//     response.send({
//         name: 'saiteja',
//         age: '20',
//         job: 'intern'
//     })
// })

// app.get('/basic2', (request, response) => {
//     response.send([{
//         name: 'saiteja',
//         age: '20',
//         job: 'intern'
//     }, {
//         name: 'saitej',
//         age: '21',
//         job: 'android intern'
//     }])
// })

// app.get('/basichtml', (request, response) => {
//     response.send('<h1>my name is saiteja uzumaki</h1>')
// })

const request = require('request')


const api_Key = "68ca3c492fe93dd17c6ed359a109b399"

const geoCode = (address, callback) => {
    const data = {
        latitude: 0,
        longitude: 0
    }
    const latlongurl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?access_token=pk.eyJ1Ijoic2FpdGVqYTEyMjAyNiIsImEiOiJja242OXA3dnUwNjI2MnBuemJ6aWd3c3N0In0.xjnYcGRBqmsA4RYon3nBKg&limit=1"
    request({ url: latlongurl, json: true }, (error, response) => {
        if (error) {
            callback('unable to connect to location services')
        }
        else if (response.body.features.length == 0) {
            callback('unable to find for specified location try again', undefined)
        }
        else {
            data.latitude = response.body.features[0].center[1]
            data.longitude = response.body.features[0].center[0]
            callback(undefined, response.body.features[0])
        }
    })

}



const getWeatherInfo = ({ center } = {}, callback) => {
    const BASE_URL = "http://api.weatherstack.com/current?access_key=68ca3c492fe93dd17c6ed359a109b399&query=" + center[1] + "," + center[0] + "&metrics=m"
    request({ url: BASE_URL, json: true }, (error, response) => {

        // const data=JSON.parse(response.body)
        // console.log(data.current)
        if (error) {
            callback('unable to connect', undefined)
        }
        else if (response.body.error) {
            callback(response.body.error, undefined)
        }
        else {
            callback(undefined, response.body.current)
        }
    })
}

app.listen(port, () => {
    console.log('Server is up on port 3000.')
})


