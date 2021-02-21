const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;

// app의 등장도 헷갈림..ㅋㅋ
app.use(express.json());
app.use(cors());

app.get('/products', (req, res) => {
    const query = req.query;
    console.log('query : ', query);
    res.send({
        products: [
            {
                id: 1,
                name: '농구공',
                price: 100000,
                seller: '조던',
                imageUrl: 'images/products/basketball1.jpeg',
            },
            {
                id: 2,
                name: '축구공',
                price: 50000,
                seller: '메시',
                imageUrl: 'images/products/soccerball1.jpg',
            },
            {
                id: 3,
                name: '키보드',
                price: 10000,
                seller: '그랩',
                imageUrl: 'images/products/keyboard1.jpg',
            },
        ],
    });
});

app.post('/products', (req, res) => {
    const body = req.body;
    res.send({
        body: body,
        // es6에서는 키랑 밸류가 같으면 그냥 body라고만 써도 됨.
    });
});

app.get('/products/:id', (req, res) => {
    const params = req.params;
    const { id } = params;
    res.send(`id는 ${id}입니다`);
});

app.listen(port, () => {
    console.log('그랩의 서버가 돌아가고 있습니다.');
});
