export default async function handler(req, res) {
    const { address } = req.query;
  
    try {
      const response = await fetch(`https://blockstream.info/api/address/${address}`);
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch address' });
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Network error' });
    }
  }
  