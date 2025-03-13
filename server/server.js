import cors from 'cors';
import e from 'express';

const app = e();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ['http://127.0.0.1:5173'],
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json({
    serverText: 'This text came from server HA!',
  });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server started at port ${PORT}`);
});
