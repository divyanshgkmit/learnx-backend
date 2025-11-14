import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Server Working!')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});