const {connectDB}=require('../src/db/index.js')
const {app}=require('./app.js')

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server is running on port http://${process.env.HOSTNAME}:${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log('Error connecting to DB',err)
})