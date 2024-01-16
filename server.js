const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/test');

const Cat = mongoose.model('Cat', { name: String, age: Number });

app.listen(8080, () => {
  console.log('8080에서 서버 실행');
});

app.get('/', async (req, res) => {
  console.log('8080에서 서버 실행');
  const cats = await Cat.find();
  res.render('main.ejs', { cats: cats });
});
app.post('/cat/add', async (req, res) => {
  if (req.body.name.trim().length === 0 || req.body.age.trim().length === 0) {
    return res.send('빈칸을 채워서 입력하세요');
  }
  const name = req.body.name;
  const age = +req.body.age;
  const requsetCat = new Cat({ name: name, age: age });

  await requsetCat
    .save()
    .then(() => {
      console.log(requsetCat, '고양이 청보 추가 완료');
      res.redirect('/cat/list');
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});
app.get('/cat/add', (req, res) => {
  res.render('create.ejs');
});
app.get('/cat/list', async (req, res) => {
  const cats = await Cat.find();
  res.render('main.ejs', { cats: cats });
});
app.get('/cat/:detail', async (req, res) => {
  const cat = await Cat.findById(req.params.detail);
  console.log(cat);
  res.render('detail.ejs', { cat: cat });
});
