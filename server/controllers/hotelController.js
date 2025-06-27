import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async(req,res) => {
    try{
        const{name, address, contact, city} = req.body;

        //const owner = req.user._id;
        let owner;
        if(req.user && req.user._id){
            owner = req.user._id;
            console.log("Using existing user as owner:", owner);
        } else{
            console.log("No User found, creating default");
            let user = await User.findOne();
            if(!user){
                user = await User.create({
                    username: "defaultowner",
                    email: "owner@hotel.com",
                    role: "hotelOwner"
                });
            }
            owner = user._id;
        }

        //Check if User already register
        //const hotel = await Hotel.findOne({owner});
        //if(hotel){
        //    return res.status(400).json({success: false, message: "Hotel Already Registered"});
        //}

        //const existingHotel = await Hotel.findOne({name, address, city});
        //if(existingHotel){
        //    return res.status(400).json({success: false, message:"Hotel with same info already exists"})
        //}

        
        const newHotel = await Hotel.create({name, address, contact, city, owner});
        console.log("Hotel created successfully:", newHotel);

        await User.findByIdAndUpdate(owner, {role: "hotelOwner"}, {new: true});

        res.status(201).json({success: true, message: "Hotel Registered Successfully", hotel: newHotel});

    } catch(error) {
        console.error("Error in registerHotel:", error);
        res.status(400).json({success: false, message: error.message});
    }
}