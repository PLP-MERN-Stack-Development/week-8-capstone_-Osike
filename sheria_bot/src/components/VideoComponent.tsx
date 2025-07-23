import React from "react";  
import myVideo from "public/video.mp4"; // did this for deployment issues 


function VideoComponent() {
    return (
     <div className='video_wrap'>
        <video 
         src={myVideo} 
         autoPlay
         muted
         loop
         className="background_video">
               
        </video>
     </div>
    ); 
}      
export default VideoComponent;
