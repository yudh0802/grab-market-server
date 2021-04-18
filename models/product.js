module.exports = function (sequelize, DataTypes) {
    const product = sequelize.define('Product', {
        name: {
            // STRING 괄호 안에 20 넣은 건, 이 name의 글자 길이를 20으로 제한하겠다는 뜻.
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        seller: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        soldout: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 0,
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    });

    return product;
};
