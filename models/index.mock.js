module.exports = {
    User: {
      create: jest.fn(),
      findOne: jest.fn()

    },
    Task: {
      create: jest.fn(),
      // Add other Task model methods as needed
    },
    sequelize: {
      sync: jest.fn().mockResolvedValue(),
    },
  };