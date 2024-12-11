import mongoose from 'mongoose'

const DATABSE_URL = process.env.DATABASE_URL
mongoose.connect(DATABSE_URL)
.then(()=>console.log('🚀 Database Connected'))
.catch((err)=>console.log(err))