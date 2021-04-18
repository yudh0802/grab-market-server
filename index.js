const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const product = require('./models/product');
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cd) {
            cd(null, file.originalname);
        },
    }),
});

const detectProduct = require('./helpers/detectProduct');
const { prod } = require('@tensorflow/tfjs-node');
const port = process.env.PORT || 8080;

// app의 등장도 헷갈림..ㅋㅋ
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/banners', (req, res) => {
    models.Banner.findAll({
        limit: 2,
    })
        .then((result) => {
            res.send({
                banners: result,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('배너 에러 났다~');
        });
});

app.post('/purchase/:id', (req, res) => {
    const { id } = req.params;
    models.Product.update(
        {
            soldout: 1,
        },
        {
            where: {
                id,
            },
        }
    )
        .then((result) => {
            res.send({
                result: true,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('에러 발생');
        });
});

app.post('/cancel/:id', (req, res) => {
    const { id } = req.params;
    models.Product.update(
        {
            soldout: 0,
        },
        {
            where: {
                id,
            },
        }
    )
        .then((result) => {
            res.send({
                result: true,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('결제 취소 에러 발생');
        });
});

app.get('/products', (req, res) => {
    models.Product.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'name', 'price', 'createdAt', 'seller', 'imageUrl', 'soldout'],
    })
        .then((result) => {
            console.log('PRODUCTS : ', result);
            res.send({
                products: result,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('에러 발생');
        });
});

app.get('/products/:id/recommendation', (req, res) => {
    const { id } = req.params;
    models.Product.findOne({
        where: {
            id,
        },
    })
        .then((product) => {
            console.log(product);
            const type = product.type;
            models.Product.findAll({
                where: {
                    type,
                    id: {
                        [models.Sequelize.Op.ne]: id,
                    },
                },
            }).then((products) => {
                res.send({ products });
            });
        })
        .catch((error) => {
            console.errpr(error);
            res.status(500).send('에러가 발생했습니다. 왜?');
        });
});

app.post('/products', (req, res) => {
    const body = req.body;
    const { name, description, price, seller, imageUrl } = body;
    if (!name || !description || !price || !seller || !imageUrl) {
        res.status(400).send('모든 필드를 입력해주세요');
    }

    detectProduct(imageUrl, (type) => {
        models.Product.create({
            name,
            description,
            price,
            seller,
            imageUrl,
            type,
        })
            .then((result) => {
                console.log('상품 생성 결과 : ', result);
                res.send({
                    result: result,
                });
            })
            .catch((err) => {
                console.error(err);
                res.status(400).send('상품 업로드에 문제가 발생했습니다');
            });
    });

    //     // res.send({
    //     //     body: body,
    //     //     // es6에서는 키랑 밸류가 같으면 그냥 body라고만 써도 됨.
    //     // });ㄴ
});

app.get('/products/:id', (req, res) => {
    const params = req.params;
    const { id } = params;
    models.Product.findOne({
        where: {
            id: id,
        },
    })
        .then((result) => {
            console.log('PRODUCT : ', result);
            res.send({
                product: result,
            });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).send('상품 조회에 에러가 발생했습니다');
        });
});

// res.send() -> 여기 괄호 안에는 객체가 담긴다.

app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file;
    console.log(file);
    res.send({
        imageUrl: file.path,
    });
});

app.listen(port, () => {
    console.log('그랩의 서버가 돌아가고 있습니다.');
    models.sequelize
        .sync()
        .then(function () {
            console.log('DB 연결 성공');
        })
        .catch(function (err) {
            console.error(err);
            console.log('DB연결 에러ㅠ');
            process.exit();
        });
});

// app.get('/products', (req, res) => {
//     const query = req.query;
//     console.log('query : ', query);
//     res.send({
//         products: [
//             {
//                 id: 1,
//                 name: '농구공',
//                 price: 100000,
//                 seller: '조던',
//                 imageUrl: 'images/products/basketball1.jpeg',
//             },
//             {
//                 id: 2,
//                 name: '축구공',
//                 price: 50000,
//                 seller: '메시',
//                 imageUrl: 'images/products/soccerball1.jpg',
//             },
//             {
//                 id: 3,
//                 name: '키보드',
//                 price: 10000,
//                 seller: '그랩',
//                 imageUrl: 'images/products/keyboard1.jpg',
//             },
//         ],
//     });
// });

// app.get('/products/', (req, res) => {
//     const query = req.query;
//     console.log('쿼리값이 이렇게 올걸? :', query);
//     const searchNameResult = query.name;
//     console.log('검색결과는 이렇게 올걸? :', searchNameResult);
//     models.Product.findAll({
//         where: {
//             name: searchNameResult,
//         },
//     })
//         .then((result) => {
//             console.log('검색 결과는 이게 떠야해 : ', result);
//             res.send({
//                 product: result,
//             });
//         })
//         .catch((err) => {
//             console.error(err);
//             res.send('상품 조회에 에러가 발생했습니다');
//         });
//     });
// var products = {
//     1: {
//         name: '축구공',
//         price: 5000,
//     },
//     2: {
//         name: '농구공',
//         price: 25000,
//     },
//     3: {
//         name: '탁구공',
//         price: 1000,
//     },
// };

// console.log('id는 이렇단다 : ', id);
// var result = products[id];
// console.log('결과는 이렇단다 : ', result);
// res.send(result);
// res.send() -> 여기 괄호 안에는 객체가 담긴다.
