import axios from 'axios';

export default async function handler(req, res) {
  const { address } = req.query;
  const apiUrl = `https://blockstream.info/api/address/${address}`;
  
  try {
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
