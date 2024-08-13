const express = require('express');
const router = express.Router();
const Theatre = require('./models/theatre');
const {z} = require('zod');
const jsonwebtoken = require('jsonwebtoken');
const jsonwebtokenSecret = process.env.JWT_SECRET;


// Define the Zod schema for validation of theatre
// const theatreSchema = z.object({
//     name: z.string().min(1, "Name is required"),
    // city: z.string().min(1, "City is required"),
    // ticketPrice: z.number().min(0, "Ticket price must be a non-negative number"),
    // rows: z.number().int().positive("rows must be a positive integer"),
    // cols: z.number().int().positive("cols must be a positive integer"),
    // If you decide to include the image field, you can add:
    // image: z.string().url().optional(), // URL must be a valid URL if provided
//   });

router.get('/test',(req,res)=>{
    res.json({message:"test ok"});
})  

//create new theatre
router.post('/adminTheatres',async (req,res)=>{
    // const validation = theatreSchema.safeParse(req.body);
    // if(!validation.success){
    //     return res.status(400).json({error: validation.error});
    // }
    const {token} = req.cookies;

    const {name,addedPhotos
        //,city, ticketPrice,seats
        } = req.body;



        jsonwebtoken.verify(token, jsonwebtokenSecret, {}, async (error, userData) => {

            if(error) throw error;
        
            const theatreDocument = await Theatre.create({
                owner: userData.id,
                name, photos: addedPhotos
                // city,
                // ticketPrice,
                // rows,
                //cols
            });
            res.status(200).json({
                message:"success",
                theatreDocument:theatreDocument});
    
        });
    
    
});

//get all theatres

router.get("/theatres",async (req,res)=>{
    const alltheatres = await Theatre.find({});

    res.json({alltheatres});
})

//SEARCH FOR A THEATRE
router.get("/searchtheatre", async (req,res)=>{
    const {searchString} = req.body;

    try{
        const theatres = await Theatre.find({name: new RegExp(searchString,'i') },'name');

        if(theatres.length>0){
            res.status(200).json({theatres});
        }else{
            res.status(404).json({message:"no theatres found"});
        }
        
    }catch(error){
        console.error('error searching theatre:',error);
        res.status(500).json({message:'internal server error'});

    }
})

//update a theatre

router.put("/theatres/:id",async (req,res)=>{
    const theatreId = req.params.id;
    const updatedata = req.body;

    try{
        //find theatre by id and update it
        const updatedtheatre = await Theatre.findByIdAndUpdate(theatreId,updatedata, {
            new: true, // Return the updated document
            runValidators: true, // Ensure the update adheres to the schema
          })

          if (updatedtheatre) {
            res.status(200).json({ message: 'theatre updated successfully', updatedtheatre });
          } else {
            res.status(404).json({ message: 'theatre not found' });
          }  

    }catch(error){
        console.error('Error updating theatre:', error);
        res.status(500).json({ message: 'Internal Server Error' });

    }
})


//delete a theatre
router.delete("/theatres/:id",async (req,res)=>{
    const theatreId = req.params.id;
    try{
        const deletedtheatre = await Theatre.findByIdAndDelete(theatreId);

        if (deletedtheatre) {
            res.status(200).json({ message: 'theatre deleted successfully', deletedtheatre });
          } else {
            res.status(404).json({ message: 'theatre not found' });
          }

    }catch(error){
        console.error("error deleting theatre",error);
        res.status(500).json({message:'internal server error'})
    }
})




module.exports = router;