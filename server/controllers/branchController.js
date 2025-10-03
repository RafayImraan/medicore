const Branch = require('../models/Branch');

// Get all branches
const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ status: 'active' })
      .select('name address phone email services operatingHours isMain facilities')
      .sort({ isMain: -1, name: 1 });

    if (branches.length === 0) {
      // Return mock data if no branches in database
      const mockBranches = [
        {
          name: 'Main Hospital - Stadium Road',
          address: {
            street: 'Stadium Road',
            city: 'Karachi',
            state: 'Sindh',
            zipCode: '74800',
            country: 'Pakistan'
          },
          phone: '+92 21 111 911 911',
          email: 'info@medicore.org',
          services: ['General Medicine', 'Emergency', 'Surgery', 'Pediatrics', 'Cardiology'],
          operatingHours: {
            monday: { open: '09:00', close: '17:00' },
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '14:00' },
            sunday: { open: 'Closed', close: 'Closed' }
          },
          isMain: true,
          facilities: ['24/7 Emergency', 'Pharmacy', 'Laboratory', 'Radiology']
        },
        {
          name: 'Downtown Clinic',
          address: {
            street: 'Saddar Area',
            city: 'Karachi',
            state: 'Sindh',
            zipCode: '74400',
            country: 'Pakistan'
          },
          phone: '+92 21 111 911 912',
          email: 'downtown@medicore.org',
          services: ['General Medicine', 'Pediatrics', 'Dermatology'],
          operatingHours: {
            monday: { open: '08:00', close: '16:00' },
            tuesday: { open: '08:00', close: '16:00' },
            wednesday: { open: '08:00', close: '16:00' },
            thursday: { open: '08:00', close: '16:00' },
            friday: { open: '08:00', close: '16:00' },
            saturday: { open: '09:00', close: '13:00' },
            sunday: { open: 'Closed', close: 'Closed' }
          },
          isMain: false,
          facilities: ['Pharmacy', 'Laboratory']
        }
      ];
      return res.json(mockBranches);
    }

    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    // Fallback mock data
    const fallbackBranches = [
      {
        name: 'Main Hospital',
        address: {
          street: 'Stadium Road',
          city: 'Karachi',
          state: 'Sindh',
          zipCode: '74800',
          country: 'Pakistan'
        },
        phone: '+92 21 111 911 911',
        email: 'info@medicore.org',
        services: ['General Medicine', 'Emergency', 'Surgery'],
        operatingHours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '09:00', close: '14:00' },
          sunday: { open: 'Closed', close: 'Closed' }
        },
        isMain: true,
        facilities: ['24/7 Emergency', 'Pharmacy']
      }
    ];
    res.json(fallbackBranches);
  }
};

// Get branch by ID
const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    res.json(branch);
  } catch (error) {
    console.error('Error fetching branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get main branch
const getMainBranch = async (req, res) => {
  try {
    const mainBranch = await Branch.findOne({ isMain: true, status: 'active' });
    if (!mainBranch) {
      // Return mock main branch
      return res.json({
        name: 'Medicore Health Services',
        address: {
          street: 'Stadium Road',
          city: 'Karachi',
          state: 'Sindh',
          zipCode: '74800',
          country: 'Pakistan'
        },
        phone: '+92 21 111 911 911',
        email: 'info@medicore.org'
      });
    }
    res.json(mainBranch);
  } catch (error) {
    console.error('Error fetching main branch:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get branches by city
const getBranchesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const branches = await Branch.find({
      'address.city': new RegExp(city, 'i'),
      status: 'active'
    });

    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches by city:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getBranches,
  getBranchById,
  getMainBranch,
  getBranchesByCity
};
