const sequelize = require('../config/connection');
const seedSubject = require('./SubjectData');
const seedPost = require('./PostData');

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await seedSubject();

  await seedPost();

  process.exit(0);
};


