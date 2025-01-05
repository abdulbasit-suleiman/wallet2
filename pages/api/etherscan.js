// pages/api/etherscan.js
import axios from 'axios';

export default async function handler(req, res) {
  const { address, apiKey } = req.query;
  try {
    const response = await axios.get(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching balance' });
  }
}
