'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
	.filter(file => {
		return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
	})
	.forEach(file => {
		const model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

db.User.hasMany(db.Region, { foreignKey: { name: 'creator', allowNull: false } });
db.User.hasMany(db.Region, { foreignKey: { name: 'modifier', allowNull: false } });
db.User.hasMany(db.Hashtag, { foreignKey: { name: 'creator', allowNull: false } });
db.User.hasMany(db.Hashtag, { foreignKey: { name: 'modifier', allowNull: false } });
db.User.hasMany(db.Post, { foreignKey: { name: 'creator', allowNull: false } });
db.User.hasMany(db.Post, { foreignKey: { name: 'modifier', allowNull: false } });
db.User.hasMany(db.Comment, { foreignKey: { name: 'creator', allowNull: false } });
db.User.hasMany(db.Comment, { foreignKey: { name: 'modifier', allowNull: false } });

db.Region.hasMany(db.Post, { foreignKey: { name: 'regionId', allowNull: false } });

db.Post.hasMany(db.Comment, { foreignKey: { name: 'postId', allowNull: false } });

db.Post.belongsToMany(db.Hashtag, {
	through: 'Tags',
	foreignKey: { name: 'postId', allowNull: false },
	otherKey: { name: 'hashtagId', allowNull: false }
});

db.User.belongsToMany(db.Post, {
	through: 'Likes',
	foreignKey: { name: 'userId', allowNull: false },
	otherKey: { name: 'postId', allowNull: false }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const driver = async () => {
	try {
		await db.sequelize.sync();
		console.log('Initialization complete...');
	} catch (error) {
		console.error('Fail initialization!!! : ', error);
		return process.exit(1);
	}
};

driver();

module.exports = db;
