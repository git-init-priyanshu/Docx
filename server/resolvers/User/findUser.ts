export const findUser = async()=>{
    try {
            const { token } = req.body;
            console.log("token", token);
            if (!token) return res.json({ success: false });
            const output = jwt.decode(token);
            const userId = output.user.id;
        
            const user = await User.findById(userId);
        
            if (user) return res.status(200).json({ success: true });
            return res.json({ success: false });
          } catch (error) {
            res.status(401).json({ success: false });
            console.log(error);
          }
}