// In your /api/proxy endpoint handler
app.get('/api/proxy', async (req, res) => {
  const { address } = req.query;
  try {
      if (!address || !isValidBitcoinAddress(address)) {
          throw new Error('Invalid Bitcoin address');
      }
      const result = await callExternalAPI(address); // Make sure to handle external API errors
      res.json(result);
  } catch (error) {
      console.error('Error in /api/proxy:', error);
      res.status(500).json({ error: error.message });
  }
});
