const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended: true
}))


var db
MongoClient.connect('mongodb+srv://heidi3115:Lx4o1IXlTgfJ40qN@test-001.2ek0qij.mongodb.net/?retryWrites=true&w=majority', (err, client) => {
    if(err) return console.log(err)

    db = client.db('todoapp') // todoapp이라는 폴더에 연결하겠다
    // db.collection('post').insertOne({_id: 100, '이름': 'minseon', '나이': '10'},(err, result) => {
    //     console.log('저장완료')
    // })

    app.listen(8080, () => {
        console.log('listening on 8080')
    }) // 서버 띄울 포트번호, 띄운 후 실행할 코드 입력
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/write', (req, res) => {
    res.sendFile(__dirname + '/write.html')
})



app.post('/add', (req, res) => {
    db.collection('counter').findOne({name: 'postNumber'}, (err, result) => {
        const totalPost = result.totalPost
        db.collection('post').insertOne({_id: totalPost+1, 'title': req.body.title, 'date': req.body.date})
        // id를 넣어주지 않으면 랜덤한 아이디가 저절로 생성됨
        db.collection('counter').updateOne({name: 'postNumber'},{$inc : {totalPost: 1}},(err, result)=>{
            if(err) {
                return console.log(err)
            }
        }) // 한번에 여러개 하려면 updateMany()
        // counter 컬렉션에 있는 totalPost 도 1씩 증가돼야 함.
        // 데이터를 수정할때(update류)는 operator를 사용해야함. 그냥 {totalPost: +1}이 아니라, 중괄호에 한번 더 담아서 operator와 함께 사용 필요
        // set: 바꿔주세요~
        // inc: 기존값에 더해주세요. 음수도 가능
    })
})


app.get('/list', (req, res) => {
    db.collection('post').find().toArray((err, result) => {
        console.log(result)
        res.render('list.ejs', {posts: result})
    }) // post의 모든 데이터 꺼내오기
})

app.delete('/delete', (req, res) => {
    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne({_id: req.body._id}, (err, result)=>{
        console.log('삭제완료')
        res.status(200).send({message: '성공했습니다'})
    })
})