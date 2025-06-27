import User from "../models/User.js"

export const getUserData = async (req,res) => {
    try{
        
        if(!req.user) {
            return res.json({
                success: true ,
                role: "user",
                recentSearchedCities: []
            });
        }
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities || [];
        res.json({success: true, role, recentSearchedCities})
    } catch (error) {
        console.error("Error is getUserData:", error);
       res.status(500).json({success: false , message: error.message})
    }
}

//store User Searched Cities
export const storeRecentSearchedCities = async (req,res) => {
    try{
       const {recentSearchedCities} = req.body;
       const user = await User.findById(req.user._id);

       if(!user){
        return res.status(404).json({ success: false, message: "User not found"});
       }

       if(user.recentSearchedCities.length < 3){
        user.recentSearchedCities.push(recentSearchedCities);
       }else{
        user.recentSearchedCities.shift();
        user.recentSearchedCities.push(recentSearchedCities);
       }
       await user.save();
       res.json({success: true, message: "City added"});

    }catch(error) {
        console.error("Error in storeRecentSearchedCities:", error);
        res.status(500).json({success: false, message: error.message})
    }
};