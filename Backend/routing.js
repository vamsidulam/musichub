const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
const loginschema=require('./models/loginschema');
const playpauseschema=require('./models/playpauseschema');
const likedetailsschema=require('./models/likeschema');
const songschema=require('./models/songschema');
const trendingsongsschema=require('./models/trendingsongsschema');
const singerschema=require('./models/singerschema');
const playlistschema=require('./models/playlistschema');

const jwt=require('jsonwebtoken');
require('dotenv').config();
const bcrypt=require('bcryptjs');

app.get('/getallsongs',async(req,res)=>{
    try{
        const allsongs=await songschema.find();
        res.json({msg:"imported all songs from DB",allsongs});
    }
    catch(err){
        res.status(404).json({msg:"error occured"});
    }
});

app.get('/getallsingers',async(req,res)=>{
    try{
        const allsingers=await singerschema.find();
        res.json({msg:"imported all singers from DB",allsingers});
    }
    catch(err){
        res.status(404).json({msg:"error occured"});
    }
});

app.get('/getalltrendingsongs',async(req,res)=>{
    try{
        const alltrendingsongs=await trendingsongsschema.find();
        res.json({msg:"imported all trending songs from DB",alltrendingsongs});
    }
    catch(err){
        res.status(404).json({msg:"error occured"});
    }
});

app.post('/register',async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const found=await loginschema.findOne({email:email});
        const role=email==='vamsidulam11@gmail.com'?'admin':'user';
        if(found){
            res.json({msg:`Already Registered with this email ${email}`});
            return;
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const date=new Date();
        const user=new loginschema({name,email,password:hashedpassword,role,registeredat:date});
        await user.save();
        res.json({msg:"Registered Successfully"});
    }
    catch(err){
        res.status(404).json({msg:`error occured in pushing into db for ${email}`});
    }
});

app.get('/user/:email', async (req, res) => {
  try {
    const user = await loginschema.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.post('/blockuser',async(req,res)=>{
    try{
        const {email}=req.body;
        const found=await loginschema.findOne({email:email});
        if(found.role==='admin'){
            res.json({msg:`Unable to block Admin ${email} `});
            return;
        }
        if(found){
            found.blocked=true;
            await found.save();
        }
        res.json({msg:"Blocked the user"});
    }
    catch(err){
        res.status(500).json({ msg: "Server error" });
    }
});

app.post('/unblockuser',async(req,res)=>{
    try{
        const {email}=req.body;
        const found=await loginschema.findOne({email:email});
        if(found){
            found.blocked=false;
            await found.save();
        }
        res.json({msg:"UnBlocked the user"});
    }
    catch(err){
        res.status(500).json({ msg: "Server error" });
    }
});

app.post('/removesongfromapp', async (req, res) => {
  try {
    const { id, songname } = req.body;

    // 1. Find the song in songschema
    const found = await songschema.findOne({ _id: id, songname });
    if (!found) {
      return res.status(404).json({ msg: "No song found in songschema" });
    }

    await songschema.deleteOne({ _id: id });

    await trendingsongsschema.deleteMany({ _id: id });

    const singer = await singerschema.findOne({ singername: found.singername });
    if (singer) {
      singer.songslist = singer.songslist.filter(song => song.songid.toString() !== id);
      await singer.save();
    }

    await playpauseschema.deleteMany({ songid: id });


    await likedetailsschema.deleteMany({ songid: id });

    res.status(200).json({ msg: `Song '${songname}' removed from all sources` });

  } catch (err) {
    console.error('Error in removing song:', err);
    res.status(500).json({ msg: 'Server error while removing song' });
  }
});



app.post('/login',async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        const found=await loginschema.findOne({email:email});
        if(!found){
            res.json({msg:"No user found go and Register"});
            return;
        }
        if(found.blocked)
        {
            res.json({msg:"You have been Blocked by Admin"});
        }
        const ismatch=await bcrypt.compare(password,found.password);
        if(!ismatch){
            res.json({msg:"Incorrect Password"});
            return;
        }
        const role=found.role;
        const token=jwt.sign(
            {
                name:found.name,
                email:found.email,
                role:role
            },
            process.env.SECRET_KEY,
            {
                expiresIn:'3hr'
            }

        )
        res.json({msg:"Logged in Successfully",token,email:found.email,name:found.name,role:found.role});
    }
    catch(err){
        res.status(404).json({msg:`error occured in pushing into db for ${email}`});
    }
});

app.get('/getallusers',async(req,res)=>{
    try{
        const allusers=await loginschema.find();
        res.status(200).json({msg:"recieved all users",allusers});
    }
    catch(err){
        res.status(404).json({msg:"error occured in getting users data"});
    }
});

app.post('/changepassword',async(req,res)=>{
    const {name,email,password,confirmpassword}=req.body;
    try{
        const found=await loginschema.findOne({email:email});
        if(!found){
            res.json({msg:"No user found go and Register"});
            return;
        }
        if(password!==confirmpassword){
            res.json({msg:"Please Enter same password"});
            return;
        }
        const hashedpassword=await bcrypt.hash(confirmpassword,10);
        found.password=hashedpassword;
        await found.save();
        
        res.json({msg:"Password Changed Successfully"});
    }
    catch(err){
        res.status(404).json({msg:`error occured in pushing into db for ${email}`});
    }
});


app.post('/playsong', async (req, res) => {
  try {
    const { email, songid, songname, playedtime } = req.body;

     if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const existing = await playpauseschema.findOne({ email: email, songid: songid });

    const currentTime = new Date();

    if (existing) {
      existing.playedtime = playedtime;
      existing.clickedat = currentTime;
      existing.updatedtime = currentTime;
      await existing.save();

      return res.status(200).json({ msg: 'Updated song play/pause data', data: existing });
    }
    const newPlayPause = new playpauseschema({
      email,
      songid,
      songname,
      playedtime,
      clickedat: currentTime,
      updatedtime: currentTime
    });

    await newPlayPause.save();

    res.status(201).json({ msg: 'Created new play record', data: newPlayPause });
  } catch (error) {
    console.error('Error in /playsong:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.get('/recentlyplayed',async(req,res)=>{
    try{
        const {email}=req.query;
        const found=await playpauseschema.findOne({email:email});
        if(found){
            const recentdata=await playpauseschema.find({email}).sort({clickedat:-1}).limit(8).select('songid songname -_id');
            res.status(200).json({msg:"recently played data fetched",recentdata});
        }
    }
    catch(err){
        res.status(404).json({msg:"error occured"});
    }
});

app.get('/likeddetails',async(req,res)=>{
    try{
        const likedetails=await likedetailsschema.find();
        res.status(200).json({msg:"liked songs data received",likedetails});
    }
    catch(err){
        res.status(404).json({msg:"error occured in fetching liked song details"});
    }
});

app.post('/likesong',async(req,res)=>{
    try{
        const {email,songid,songname,songimg,liked}=req.body;
        const date=new Date();
        const found=await likedetailsschema.findOne({useremail:email,songid:songid});
        if(found){
            found.liked=liked;
            found.likedat=date;
            await found.save();
            res.status(200).json({msg:liked?"liked":"unliked",likeddata:liked});
            return;
        }
        const user=new likedetailsschema({
            useremail:email,
            songid:songid,
            songname:songname,
            songimg:songimg,
            liked:true,
            likedat:date
        });
        await user.save();
        res.status(201).json({msg:"new liked",likeddata:true});
        return;
    }
    catch(err){
        res.status(404).json({msg:"error occured"});
    }
});

app.get('/likes',async(req,res)=>{
    try{
        const {email,songid}=req.query;
        const found=await likedetailsschema.findOne({useremail:email,songid});
        const likedata=found?found.liked:false;
        res.json({msg:found?"found the like":"no like found",likedata})
    }
    catch(err){
        res.status(404).json({msg:"not found like"});
    }
});

app.get('/getsinger/:id', async (req, res) => {
  try {
    const singer = await singerschema.findById(req.params.id);
    if (!singer) return res.status(404).json({ msg: "Singer not found" });
    res.status(200).json({ msg: "Singer found", singer });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

const multer=require('multer');
const {Readable}=require('stream');
const cloudinary=require('./cloudinaryConfig');

const storage=multer.memoryStorage();
const upload=multer({storage});

const uploadtocloudinary=(fileBuffer,folder,resourceType)=>{
    return new Promise((resolve,reject)=>{
        const stream=cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type:resourceType
            },
            (error,result)=>{
                if(error) reject (error);
                else resolve(result.secure_url);
            }
        );
        const readable=new Readable();
        readable._read=()=>{};
        readable.push(fileBuffer);
        readable.push(null);
        readable.pipe(stream);
    });
};

// app.post('/uploadnewsong',upload.fields([
//     {name:'songfile',maxCount:1},
//     {name:'thumbnail',maxCount:1}
// ]),async(req,res)=>{
//     try{
//         const {songname,language,singername}=req.body;
//         const uploadedat = new Date();
//         const singerfound=await singerschema.findOne({singername});
//         if(!singerfound){
//             res.status(404).json({msg:`no singer found with name ${singername}`});
//             return;
//         }
//         const songurl=await uploadtocloudinary(
//             req.files['songfile'][0].buffer,
//             `songs/${singername}`,
//             'video'
//         );
//         const songthumbnail=await uploadtocloudinary(
//             req.files['thumbnail'][0].buffer,
//             `songs/${singername}/songimages`,
//             'image'
//         );

//         const newsong=new songschema({
//             songname,
//             songurl,
//             songthumbnail,
//             singername,
//             language,
//             uploadedat
//         });
//         await newsong.save();

        
//         singerfound.songslist.push({
//             songname,
//             songthumbnail,
//             language,
//             songurl,
//             songid: newsong._id,
//         });
//         await singerfound.save();
        
//     }
//     catch(err){
//         console.error('Upload error:', err);
//         res.status(500).json({ msg: 'Server error while uploading song' });
//     }
// });


app.post('/uploadnewsong', upload.fields([
  { name: 'songfile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { songname, language, singername } = req.body;
    const uploadedat = new Date();

    const singerfound = await singerschema.findOne({ singername });
    if (!singerfound) {
      return res.status(404).json({ msg: `No singer found with name ${singername}` });
    }

    const songurl = await uploadtocloudinary(
      req.files['songfile'][0].buffer,
      `songs/${singername}`,
      'video'
    );

    const songthumbnail = await uploadtocloudinary(
      req.files['thumbnail'][0].buffer,
      `songs/${singername}/songimages`,
      'image'
    );

    const newsong = new songschema({
      songname,
      songurl,
      songthumbnail,
      singername,
      language,
      uploadedat
    });

    await newsong.save();

    singerfound.songslist.push({
      songname,
      songthumbnail,
      language,
      songurl,
      songid: newsong._id,
    });

    await singerfound.save();

    return res.status(201).json({ msg: 'Song uploaded successfully', song: newsong });

  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ msg: 'Server error while uploading song' });
  }
});


app.post('/addnewsingerwithsong',
  upload.fields([
    { name: 'singerpic', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
    { name: 'songaudio', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { singername, songname, language } = req.body;
      const uploadedat = new Date();

    
      const existingSongInSongs = await songschema.findOne({ songname, singername });
      const existingSinger = await singerschema.findOne({ singername });

      if (existingSongInSongs || (existingSinger && existingSinger.songslist.some(song => song.songname === songname))) {
        return res.status(409).json({ msg: 'Song already exists', code: 'SONG_EXISTS' });
      }


      const singerimage = await uploadtocloudinary(
        req.files['singerpic'][0].buffer,
        `songs/songimages/${singername}`,
        'image'
      );

      
      const songthumbnail = await uploadtocloudinary(
        req.files['thumbnail'][0].buffer,
        `songs/${singername}/songimages`,
        'image'
      );

      
      const songurl = await uploadtocloudinary(
        req.files['songaudio'][0].buffer,
        `songs/${singername}`,
        'video'
      );

    
      const newsong = new songschema({
        songname,
        songurl,
        songthumbnail,
        singername,
        language,
        uploadedat,
      });
      await newsong.save();

      
      const newSinger = new singerschema({
        singername,
        singerimg:singerimage,
        songslist: [{
            songname,
            songthumbnail,
            language,
            songurl,
            songid: newsong._id,
        }],
      });
      await newSinger.save();

      res.status(201).json({ msg: 'Singer and song uploaded successfully', singer: newSinger, song: newsong });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ msg: 'Server error during upload' });
    }
  }
);

app.post('/addtotrendingsongs', async (req, res) => {
  try {
    const { songid } = req.body;
    const found = await songschema.findById(songid);
    if (!found) return res.status(404).json({ msg: 'Song not found' });

    const alreadyExists = await trendingsongsschema.findOne({ songid });
    if (alreadyExists) return res.status(409).json({ msg: 'Already in trending' });

    const trending = new trendingsongsschema({
      _id:songid,
      songname: found.songname,
      songurl: found.songurl,
      songthumbnail: found.songthumbnail,
      singername: found.singername,
      language: found.language,
    });

    await trending.save();
    res.status(201).json({ msg: 'Added to trending', trending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


app.get('/checktrending', async (req, res) => {
  try {
    const { songid } = req.query;
    const foundsong = await trendingsongsschema.findOne({ _id: songid });

    const returnval = !!foundsong;
    res.json({ msg: returnval ? "Found in trending" : "Not in trending", returnval });
  } catch (err) {
    console.error('Error in /checktrending:', err);
    res.status(500).json({ msg: "Server error", returnval: false });
  }
});


app.post('/removefromtrendingsongs', async (req, res) => {
  try {
    const { songid } = req.body;

    const deleted = await trendingsongsschema.deleteOne({ _id: songid });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ msg: 'Song not found in trending' });
    }

    res.status(200).json({ msg: 'Removed from trending successfully' });
  } catch (err) {
    console.error('Error removing trending song:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// app.post('/newplaylist',async(req,res)=>{
//   try{
//     const {playlistname,useremail}=req.body;
//     const found=await playlistschema.findOne({playlistname,useremail});
//     if(found)
//     {
//       res.json({msg:`Exits a Playlist with ${playlistname}`});
//       return;
//     }
//     const newplay=new playlistschema({
//       playlistname,
//       useremail
//     });
//     await newplay.save();
//     res.json({msg:`${playlistname} created`});
//   }
//   catch(err){
//     res.status(404).json({msg:"error occured"});
//   }
// });

// app.get('/getallplaylists/:email',async(req,res)=>{
//   try{
//     const allplaylists=await playlistschema.find({useremail:email});
//     res.json({msg:"received all playlists",allplaylists});
//   }
//   catch(err){
//     res.json({msg:"error occured in getting all playlists"});
//   }
// });

app.get('/getallplaylists/:useremail', async (req, res) => {
  try {
    const { useremail } = req.params;  // ✅ Correct
    const allplaylists = await playlistschema.find({ useremail });
    res.json({ msg: "received all playlists", allplaylists });
  } catch (err) {
    console.error('Error fetching playlists:', err);
    res.status(500).json({ msg: "Error occurred in getting all playlists" });
  }
});


//const Playlist = require('./models/playlistschema');

app.post('/newplaylist', async (req, res) => {
  try {
    const { playlistname, useremail } = req.body;

    const found = await playlistschema.findOne({ playlistname, useremail });
    if (found) {
      return res.status(409).json({ msg: `Playlist already exists with name ${playlistname}` });
    }

    const newPlaylist = new playlistschema({ playlistname, useremail });
    await newPlaylist.save();

    res.status(201).json({ msg: "Created new playlist" });
  } catch (err) {
    console.error("Error creating playlist:", err);
    res.status(500).json({ msg: `Error occurred in creating new playlist: ${err}` });
  }
});

app.post('/addtoplaylist',async(req,res)=>{
    try{
        const {playlistid,playlistname,useremail,id,songname,songthumbnail,songurl,language,singername}=req.body;
        const found=await playlistschema.findById(playlistid);
        if(!found){
            res.json({msg:"no playlist found"});
            return;
        };
        found.songslist.push({
            songid:id,
            songname,
            songurl,
            songthumbnail,
            language
        });
        await found.save();
        res.json({msg:"added to playlist"});

    }
    catch(err){
        res.status(404).json("error occured in adding song to playlist");
    }
});

app.post('/removefromplaylist',async(req,res)=>{
    try{
        const {playlistid,id}=req.body;
        const found=await playlistschema.findById(playlistid);
        if(!found){
            res.json({msg:"no playlist found"});
            return;
        }
        found.songslist = found.songslist.filter(song => song._id.toString() !== id);
        await found.save();
        res.json({msg:"removed song successfully"});
    }
    catch(err){
        res.status(404).json({msg:"error occured in removing song from playlist"});
    }
});

app.post('/removeplaylist',async(req,res)=>{
    try{
        const {id}=req.body;
        const found=playlistschema.findById(id);
        if(!found){
            res.json({msg:"no playlist found"});
            return;
        }
        await playlistschema.findByIdAndDelete(id);
        res.json({msg:"deleted playlist"});
    }
    catch(err){
        res.status(404).json({msg:"error occured in deletion of playlist"});
    }
});

module.exports=app;
