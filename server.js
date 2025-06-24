// Backend seguro para exponer la API de OpenAI a tu frontend
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/api/chat', async (req, res) => {
  const { mensaje } = req.body;
  if (!mensaje) {
    return res.status(400).json({ error: 'Falta el mensaje' });
  }

  try {
    const respuestaOpenAI = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: mensaje }]
      })
    });
    const data = await respuestaOpenAI.json();
    const texto = data.choices?.[0]?.message?.content || 'Sin respuesta.';
    res.json({ respuesta: texto });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar OpenAI', detalle: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
