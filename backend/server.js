const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await createPrincipalAccount();
  })
  .catch(err => console.log('❌ MongoDB Error:', err));

// Auto-create the Principal account on first run
async function createPrincipalAccount() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const existing = await User.findOne({ role: 'principal' });
  if (!existing) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('principal@123', salt);
    await User.create({
      name: 'Principal',
      email: 'principal@smvit.edu',
      password: hashed,
      role: 'principal',
      isApproved: true
    });
    console.log('✅ Principal account created: principal@smvit.edu / principal@123');
  }
}

app.use('/api/auth', require('./routes/auth'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ message: 'SMVIT Meeting API running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));