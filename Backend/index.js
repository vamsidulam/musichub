// const express=require('express');
// const app=express();
// const cors=require('cors');
// const router=require('./routing');
// const dotenv=require('dotenv');

// dotenv.config();
// app.use(cors());
// app.use(express.json());
// app.use('/',router);

// const PORT=process.env.PORT;

// app.listen(PORT,(err)=>{
//     if(err){
//         console.log("error occured in connecting melodyhub DB");
//     }
//     console.log("MelodyHub DB connected");
// })
















const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
const dotenv=require('dotenv');
const loginschema=require('./models/loginschema');
const Songschema=require('./models/songschema');
const db=require('./database');
const routing=require('./Routing');
db();
app.use('/',routing);
dotenv.config();

const data=require('../spotify-clone/src/Data/songs.json');
//const trendingsongs=require('../spotify-clone/src/Data/Trendingsong.json');
const singers=require('../spotify-clone/src/Data/singers.json');
// const rawdata=require('../spotify-clone/src/Data/songs.json');

const trendinssongschema=require('./models/trendingsongsschema');



const singersRaw = require('../spotify-clone/src/Data/singers.json');
//const Songschema = require('./models/songschema');
const Singerschema = require('./models/singerschema');

// const insertSingersWithCorrectSongs = async () => {
//   try {
//     for (const singer of singersRaw) {
//       const updatedSongsList = [];

//       for (const rawSong of singer.songslist) {
//         const matchedSong = await Songschema.findOne({
//           songname: { $regex: new RegExp(`^${rawSong.songname.trim()}$`, 'i') },
//           singername: { $regex: new RegExp(`^${singer.singername.trim()}$`, 'i') },
//         });

//         if (matchedSong) {
//           updatedSongsList.push({
//             songid: matchedSong._id,
//             songname: matchedSong.songname,
//             songthumbnail: matchedSong.songthumbnail,
//             songurl: matchedSong.songurl,
//             language: matchedSong.language,
//           });
//         } else {
//           console.warn(`❌ Not found: ${rawSong.songname} (${singer.singername})`);
//         }
//       }

//       const newSinger = new Singerschema({
//         singername: singer.singername,
//         singerimg: singer.singerimg,
//         songslist: updatedSongsList,
//       });

//       await newSinger.save();
//       console.log(`✅ Inserted: ${singer.singername}`);
//     }

//     console.log("🎉 All singers inserted with matched songs");
//     process.exit();
//   } catch (error) {
//     console.error("❌ Error inserting singers", error);
//     process.exit(1);
//   }
// };
//insertSingersWithCorrectSongs();


//importsongs();

// app.get('/',(req,res)=>{
//     res.send(trendingsongs);
// });
// app.get('/songs',(req,res)=>{
//     res.send(data);
// });
// app.get('/singers',(req,res)=>{
//     res.send(singers);
// })

const PORT=process.env.PORT || 4000;
app.listen(PORT,(err)=>{
    if(err){
        console.log("error occured in running port 4000");
        return;
    }
    console.log("Server is running on port 4000");
});

// const normalize = (str) =>
//   str.replace(/\s+/g, ' ').trim().toLowerCase();

// async function insertSingersWithSongs() {
//   try {
//     // Optional: Clear old singers if needed
//     await Singerschema.deleteMany({});

//     for (const singer of singersRaw) {
//       const updatedSongsList = [];

//       for (const rawSong of singer.songslist) {
//         const songnameNormalized = normalize(rawSong.songname);
//         const singernameNormalized = normalize(singer.singername);

//         const matchedSong = await Songschema.findOne({
//           $and: [
//             {
//               songname: {
//                 $regex: new RegExp(`^${songnameNormalized}$`, 'i'),
//               },
//             },
//             {
//               singername: {
//                 $regex: new RegExp(`^${singernameNormalized}$`, 'i'),
//               },
//             },
//           ],
//         });

//         if (matchedSong) {
//           updatedSongsList.push({
//             songid: matchedSong._id,
//             songname: matchedSong.songname,
//             songthumbnail: matchedSong.songthumbnail,
//             songurl: matchedSong.songurl,
//             language: matchedSong.language,
//           });
//         } else {
//           console.log(`❌ Not found: ${rawSong.songname} (${singer.singername})`);
//         }
//       }

//       // Insert only if matched songs are present
//       const result = await Singerschema.create({
//         singername: singer.singername,
//         singerimg: singer.singerimg,
//         songslist: updatedSongsList,
//       });

//       console.log(`✅ Inserted: ${singer.singername}`);
//     }

//     console.log('🎉 All singers inserted with matched songs');
//     process.exit(0);
//   } catch (err) {
//     console.error('❌ Error inserting singers:', err);
//     process.exit(1);
//   }
// }

// insertSingersWithSongs();





//const normalize = (str) => str.trim().toLowerCase();

// async function insertSongsAndSingers() {
//   try {
//     for (const singer of singersRaw) {
//       const updatedSongsList = [];

//       for (const rawSong of singer.songslist) {
//         const songnameNormalized = normalize(rawSong.songname);
//         const singernameNormalized = normalize(singer.singername);

//         // 1. Insert or find song in Song collection
//         let song = await Songschema.findOne({
//           songname: { $regex: new RegExp(`^${songnameNormalized}$`, 'i') },
//           singername: { $regex: new RegExp(`^${singernameNormalized}$`, 'i') }
//         });

//         if (!song) {
//           song = new Songschema({
//             songname: rawSong.songname.trim(),
//             songurl: rawSong.songurl,
//             songthumbnail: rawSong.songthumbnail,
//             singername: singer.singername.trim(),
//             language: rawSong.language
//           });

//           song = await song.save();
//           console.log(`✅ Inserted song: ${rawSong.songname}`);
//         } else {
//           console.log(`🎵 Song already exists: ${rawSong.songname}`);
//         }

//         // 2. Build song entry for the singer
//         updatedSongsList.push({
//           songid: song._id,
//           songname: song.songname,
//           songthumbnail: song.songthumbnail,
//           songurl: song.songurl,
//           language: song.language
//         });
//       }

//       // 3. Insert or update singer
//       const existingSinger = await Singerschema.findOne({
//         singername: { $regex: new RegExp(`^${normalize(singer.singername)}$`, 'i') }
//       });

//       if (!existingSinger) {
//         const newSinger = new Singerschema({
//           singername: singer.singername,
//           singerimg: singer.singerimg,
//           songslist: updatedSongsList
//         });

//         await newSinger.save();
//         console.log(`🎤 Inserted singer: ${singer.singername}`);
//       } else {
//         existingSinger.songslist = updatedSongsList;
//         await existingSinger.save();
//         console.log(`🔄 Updated singer: ${singer.singername}`);
//       }
//     }

//     console.log('🎉 All singers and songs inserted/updated successfully');
//   } catch (error) {
//     console.error('❌ Error inserting data:', error);
//   }
// }


//insertSongsAndSingers();

//const TrendingSong = require('./models/trendingsongsschema');

async function insertTrendingSongs() {
  try {
    const songs = await Songschema.find().limit(10); // pick any 10 songs

    const trendingDocs = songs.map(song => ({
      _id: song._id, // use the same _id
      songname: song.songname,
      songurl: song.songurl,
      songthumbnail: song.songthumbnail,
      singername: song.singername,
      language: song.language
    }));

    await TrendingSong.insertMany(trendingDocs, { ordered: false });

    console.log("🎉 Trending songs inserted successfully");
  } catch (err) {
    if (err.code === 11000) {
      console.warn("⚠️ Some trending songs already exist with those _id values");
    } else {
      console.error("❌ Error inserting trending songs:", err);
    }
  }
}

//insertTrendingSongs();
