const RecipeController = require('../controllers/RecipeController');
const RecipeCategoryController = require('../controllers/RecipeCategoryController');
const StepController = require('../controllers/StepController');
const IngredientController = require('../controllers/IngredientController');
const IngredientGroupController = require('../controllers/IngredientGroupController');
const UserController = require('../controllers/UserController');
const BudgetController = require('../controllers/BudgetController');
const CategoryController = require('../controllers/CategoryController');
const CategoryGroupController = require('../controllers/CategoryGroupController');
const CategoryBudgetedController = require('../controllers/CategoryBudgetedController');
const GoalController = require('../controllers/GoalController');
const AccountController = require('../controllers/AccountController');
const CSVMappingController = require('../controllers/CSVMappingController');
const TurnoverController = require('../controllers/TurnoverController');
const authRequired = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../config');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const path = require('path');

module.exports = (app) => {
  // Recipes
  app.get('/api/recipes/backup',
    RecipeController.backup);

  app.post('/api/recipes/:id/uploadimg',
    authRequired,
    upload.single('imgFile'),
    RecipeController.uploadimg);

  app.post('/api/recipes/restore',
    authRequired,
    upload.single('backupFile'),
    RecipeController.restore);

  app.get('/api/recipes',
    authRequired,
    RecipeController.index);

  app.get('/api/recipes/:id',
    authRequired,
    RecipeController.get);

    app.get('/api/recipe/max',
    authRequired,
    RecipeController.getMaxId);

  app.post('/api/recipes',
    authRequired,
    RecipeController.create);

  app.put('/api/recipes/:id',
    authRequired,
    RecipeController.update);

  app.delete('/api/recipes/:id',
    authRequired,
    RecipeController.delete);

  app.get('/api/recipecategories',
    authRequired,
    RecipeCategoryController.index);

  app.get('/api/recipes/:id/steps',
    authRequired,
    StepController.index);

  app.post('/api/steps',
    authRequired,
    StepController.create);

  app.put('/api/steps/:id',
    authRequired,
    StepController.update);

  app.post('/api/steps/positions',
    authRequired,
    StepController.updatePositions);

  app.delete('/api/steps/:id',
    authRequired,
    StepController.delete);

  app.get('/api/recipes/:id/ingredientgroups',
    authRequired,
    IngredientGroupController.index);

  app.get('/api/ingredientgroups/:id',
    authRequired,
    IngredientGroupController.get);

  app.get('/api/ingredientgroupsa/max',
    authRequired,
    IngredientGroupController.getMaxId);

  app.post('/api/ingredientgroups',
    authRequired,
    IngredientGroupController.create);

  app.put('/api/ingredientgroups/:id',
    authRequired,
    IngredientGroupController.update);

  app.post('/api/ingredientgroups/positions',
    authRequired,
    IngredientGroupController.updatePositions);

  app.delete('/api/ingredientgroups/:id',
    authRequired,
    IngredientGroupController.delete);

  app.get('/api/ingredientgroups/:id/ingredients',
    authRequired,
    IngredientController.index);

  app.post('/api/ingredients',
    authRequired,
    IngredientController.create);

  app.put('/api/ingredients/:id',
    authRequired,
    IngredientController.update);

  app.post('/api/ingredients/positions',
    authRequired,
    IngredientController.updatePositions);

  app.delete('/api/ingredients/:id',
    authRequired,
    IngredientController.delete);

  // Users
  app.post('/api/users/login',
    UserController.login);

  // Budgets
  app.get('/api/budgets',
    authRequired,
    BudgetController.index);

  app.get('/api/budgets/active',
    authRequired,
    BudgetController.active);

  app.put('/api/budgets/:id',
    authRequired,
    BudgetController.update);

  app.get('/api/:budgetid/budgets/list/:budgetdate',
    authRequired,
    BudgetController.list);

  app.get('/api/:budgetid/budgets/tobebudgeted/:budgetdate',
    authRequired,
    BudgetController.toBeBudgeted);

  app.get('/api/:budgetid/budgets/hidden',
    authRequired,
    BudgetController.getHiddenCount);

  app.get('/api/:budgetid/budgets/budgetedlastmonth/:budgetdate',
    authRequired,
    BudgetController.budgetedLastMonth);

  app.get('/api/budgets/budgetedlastmonth/:budgetdate/:categoryid',
    authRequired,
    BudgetController.budgetedLastMonthByCategoryId);

  app.get('/download', function(req, res) {
    const file = __dirname + '/../../uploads/favicon.png';
    res.download(path.resolve(file), 'favicon.png');
  });

  app.get('/api/:budgetid/budgets/backup',
  BudgetController.backup);

  app.post('/api/:budgetid/budgets/restore',
    authRequired,
    upload.single('backupFile'),
    BudgetController.restore);

  // Categories
  app.get('/api/categories/:id',
    authRequired,
    CategoryController.find);

  app.get('/api/:budgetid/categories',
    authRequired,
    CategoryController.index);

  app.post('/api/categories',
    authRequired,
    CategoryController.create);

  app.post('/api/categories/positions',
    authRequired,
    CategoryController.updatePositions);

  app.put('/api/categories/:id',
    authRequired,
    CategoryController.update);

  app.put('/api/:budgetid/categories/unhide',
    authRequired,
    CategoryController.unhideAll);

  app.delete('/api/categories/:id',
    authRequired,
    CategoryController.delete);

   // CategoryGroups
  app.get('/api/categorygroups/:id',
    authRequired,
    CategoryGroupController.find);

  app.get('/api/:budgetid/categorygroups',
    authRequired,
    CategoryGroupController.index);

  app.post('/api/:budgetid/categorygroups',
    authRequired,
    CategoryGroupController.create);

  app.post('/api/categorygroups/positions',
    authRequired,
    CategoryGroupController.updatePositions);

  app.put('/api/categorygroups/:id',
    authRequired,
    CategoryGroupController.update);

  app.put('/api/categorygroups/:id/unhide',
    authRequired,
    CategoryGroupController.unhide);

  app.delete('/api/categorygroups/:id',
    authRequired,
    CategoryGroupController.delete);

  // CategoriesBudgeted
  app.get('/api/categoriesbudgeted',
    authRequired,
    CategoryBudgetedController.index);

  app.put('/api/categoriesbudgeted/:id/:date',
    authRequired,
    CategoryBudgetedController.update);

  app.post('/api/:budgetid/categoriesbudgeted/lastmonth/:date',
    authRequired,
    CategoryBudgetedController.lastMonth);

  app.post('/api/categoriesbudgeted/lastmonth/:categoryid/:date',
    authRequired,
    CategoryBudgetedController.lastMonthByCategoryId);

  // Goals
  app.get('/api/goals/:id',
    authRequired,
    GoalController.find);

  app.get('/api/:budgetid/goals',
    authRequired,
    GoalController.index);

  app.post('/api/goals',
    authRequired,
    GoalController.create);

  app.put('/api/goals/:id',
    authRequired,
    GoalController.update);

  app.delete('/api/goals/:id',
    authRequired,
    GoalController.delete);

  // Accounts
  app.get('/api/accounts/:id',
    authRequired,
    AccountController.find);

  app.put('/api/accounts/:id',
    authRequired,
    AccountController.update);

  app.get('/api/:budgetid/accounts',
    authRequired,
    AccountController.index);

  app.get('/api/:budgetid/accounts/balance',
    authRequired,
    AccountController.balance);

  app.get('/api/:budgetid/accounts/spending',
    authRequired,
    AccountController.spending);

  app.post('/api/:budgetid/accounts',
    authRequired,
    AccountController.create);

  app.post('/api/accounts/:id/import',
    authRequired,
    upload.single('csvFile'),
    AccountController.import);

  // CSVMapping
  app.get('/api/csvmappings/:id',
    authRequired,
    CSVMappingController.find);

  app.get('/api/:userid/csvmappings',
    authRequired,
    CSVMappingController.index);

  app.post('/api/:userid/csvmappings',
    authRequired,
    CSVMappingController.create);

  app.put('/api/csvmappings/:id',
    authRequired,
    CSVMappingController.update);

  app.delete('/api/csvmappings/:id',
    authRequired,
    CSVMappingController.delete);

  // Turnovers
  app.get('/api/:budgetid/turnovers',
    authRequired,
    TurnoverController.index);

  app.get('/api/:budgetid/turnovers/minmaxdate',
    authRequired,
    TurnoverController.minMaxDate);

  app.get('/api/:budgetid/turnovers/payees',
    authRequired,
    TurnoverController.payees);

  app.post('/api/turnovers',
    authRequired,
    TurnoverController.create);

  app.post('/api/turnovers/copy',
    authRequired,
    TurnoverController.copy);

  app.put('/api/turnovers/:id',
    authRequired,
    TurnoverController.update);

  app.delete('/api/turnovers',
    authRequired,
    TurnoverController.delete);
}
