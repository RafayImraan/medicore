const getInsights = (req, res) => {
  try {
    // Fake Mode: Random trends (ER wait +10%, ICU stable)
    const currentERWait = Math.floor(Math.random() * 20) + 5; // 5-25 mins
    const forecastedERWait = Math.floor(currentERWait * 1.1); // +10%

    const currentICUOccupancy = Math.floor(Math.random() * 30) + 60; // 60-90%
    const forecastedICUOccupancy = currentICUOccupancy; // stable

    const currentBedOccupancy = Math.floor(Math.random() * 20) + 70; // 70-90%
    const forecastedBedOccupancy = Math.floor(Math.random() * 10) + 75; // slight variation

    const currentSurgeries = Math.floor(Math.random() * 5) + 1;
    const forecastedSurgeries = Math.floor(Math.random() * 3) + 2;

    // Generate 7-day trends
    const erWaitTrend = Array.from({ length: 7 }, (_, i) =>
      Math.max(0, currentERWait + Math.floor(Math.random() * 10) - 5)
    );
    const icuOccupancyTrend = Array.from({ length: 7 }, (_, i) =>
      Math.max(0, currentICUOccupancy + Math.floor(Math.random() * 5) - 2)
    );

    const insights = {
      current: {
        erWait: currentERWait,
        icuOccupancy: currentICUOccupancy,
        bedOccupancy: currentBedOccupancy,
        surgeries: currentSurgeries,
      },
      forecasted: {
        erWait: forecastedERWait,
        icuOccupancy: forecastedICUOccupancy,
        bedOccupancy: forecastedBedOccupancy,
        surgeries: forecastedSurgeries,
      },
      trends: {
        erWait: erWaitTrend,
        icuOccupancy: icuOccupancyTrend,
      },
      // Real Mode: Later hook ML model
      // For now, this is fake data
      mode: 'fake',
      timestamp: new Date().toISOString(),
    };

    res.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
};

module.exports = {
  getInsights,
};
