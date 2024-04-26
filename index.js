const express = require('express');
const fs = require('fs')
const path = require('path')
const bodyparser = require('body-parser');
const app = express();

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {

    fs.readdir('./data', (err, files) => {
        // console.log(files);
        res.render('index', {
            files: files,
        })
    })

})

app.get('/:filename', (req, res) => {
    fs.readFile(`./data/${req.params.filename}`, 'utf8', (err, data) => {
        res.render('data', { data: data, filename: req.params.filename })
    })
})

app.get('/edit/:filename', (req, res) => {
    res.render('edit', { oldTitle: req.params.filename })
})

// post routes

app.post('/create', (req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    description.toString();
    fs.writeFile(`./data/${title}.txt`, description, (err) => {
        if (!err) {
            res.redirect('/')
        } else {
            res.send('server error')
        }
    })
})

app.post('/edit', (req, res) => {
    fs.rename(`./data/${req.body.previous}`,`./data/${req.body.new}`,(err)=>{
        console.log(req.body);
        res.redirect('/')
    })
})

app.listen(3000, () => {
    console.log('App Running on http://localhost:3000/');
})