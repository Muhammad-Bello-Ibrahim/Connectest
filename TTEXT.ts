// Connectrix club registration endpoint
router.post('/api/clubs', async (req, res) => {
  try {
    const newClub = new Club(req.body);
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
