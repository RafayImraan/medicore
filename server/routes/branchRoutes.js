const express = require('express');
const router = express.Router();
const {
  getBranches,
  getBranchById,
  getMainBranch,
  getBranchesByCity
} = require('../controllers/branchController');

// Get all branches
router.get('/branches', getBranches);

// Get main branch
router.get('/branches/main', getMainBranch);

// Get branches by city
router.get('/branches/city/:city', getBranchesByCity);

// Get branch by ID
router.get('/branches/:id', getBranchById);

module.exports = router;
