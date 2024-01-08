import { useEffect, useState } from "react";
import openai from "../images/openai.svg";
import { useNavigate } from "react-router-dom";

function Community() {
    let navigate = useNavigate();
    let [allPost, setAllPost] = useState([]);
    let [posts, setPosts] = useState([]);
    let [show, setShow] = useState(false);
    let [loader, setLoader] = useState(false);
    let [showPrompt, setShowPrompt] = useState(null);
    let [search, setSearch] = useState(false);
    let [searchValue, setSearchValue] = useState("");
    let [searching, setSearching] = useState(false);
   
    let allTitles = [];

    useEffect(() => {
        getAllPosts();
    }, []);

    async function getAllPosts() {
        setLoader(true);
        let allPost = await fetch("https://dall-e-backend-3wtv.onrender.com/api/post", {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });
        let result = await allPost.json();
        setLoader(false);
        setPosts([...result.data].reverse());
        setAllPost([...result.data].reverse());
        
    }
    function handleMouseEnter(id) {
        setShow(true);
        setShowPrompt(id);

    }

    function handleMouseLeave() {
        setShow(false);
        setShowPrompt(null);
    }

    let downloadImage = async (e, imgLink, name) => {
        console.log(imgLink)
        e.preventDefault();
        let secureLink = "https"+imgLink.slice(4);
        let response = await fetch(secureLink);

        let bolb = await response.blob();
        // console.log(bolb);

        let link = document.querySelector(".download-link");
        let blobUrl = window.URL.createObjectURL(bolb);
        // console.log(blobUrl);
        link.href = blobUrl;
        // link.target = "_blank";
        link.download = `${name}-dall-e-image.png`;

        link.click();
        window.URL.revokeObjectURL(blobUrl);

    }

    function handleSearch(e){
        e.preventDefault();
        setSearch(true);
        setSearching(true);
        let val = e.target.value;
        setSearchValue(val);
        if(val==""){
            setAllPost([]);
            setSearching(false);
            setSearch(false);
        }
        else{
            let findSearchResult = posts.filter((post)=>post.name.toLowerCase().includes(searchValue.toLowerCase())|| post.message.toLowerCase().includes(searchValue.toLowerCase()));
            setAllPost(findSearchResult);
        }
        

        
        

    }

    

    return (
        <div className="post-div">
            <div className="container mt-3 mb-4">
                <div className="row">
                    <div className="col-lg-8 col-md-12 mx-auto">
                        <div className="nav-bar d-flex justify-content-between">
                            <div className="logo">
                                <img src={openai} className="logo-img" />
                                <span className="fw-bolder">OpenAI</span>
                            </div>
                            <div className="nav-btn">
                                <button className="comm-btn1" onClick={() => navigate('/create-image')}>Create post</button>
                            </div>
                        </div>
                        <div className="comm-main">
                            <div className="comm-showcse">
                                <p className="post-text mt-5 mb-1">Community showcase</p>
                                <p className="descrip1">Thank you for being part of our vibrant community! 🎉</p>
                                <p className="descrip">Discover a collection of inspiring posts and the creative prompts that sparked them. Dive into our community's brilliance, explore freely, and download these gems to fuel your own creativity</p>
                            </div>
                            <div className="inp">
                                <p className="post-text mt-5 mb-1">Search post</p>
                                <input type="text" placeholder="search prompts" className="form-control" 
                                value={searchValue}
                                onChange={(e)=>handleSearch(e)}/>
                                {/* <button>Search</button> */}
                                {search && <p className="mt-2">Showing result for <b>{searchValue}</b></p>}
                            </div>
                            <div>
                                <p className="post-text mt-5 ">All posts</p>
                                {loader && <div className="loader d-flex justify-content-center mb-2">
                                    <button class="btn btn-primary" type="button" disabled>
                                        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span role="status">Loading...</span>
                                    </button>
                                </div>}

                                <div className="posts d-flex justify-content-center flex-wrap gap-2 mt-1">


                                    {searching ? 
                                    allPost.map((post) => (
                                        <div className="post" onMouseEnter={() => handleMouseEnter(post._id)} onMouseLeave={handleMouseLeave}>
                                            <img src={post.image} className="post-img" />
                                            {show && showPrompt == post._id && <div className="prompt-container bg-white">
                                                {showPrompt === post._id && <p className="prompt-msg">{post.message}</p>}
                                                <div className="d-flex justify-content-between">
                                                    <a href="" className="download-link"><span class="material-symbols-outlined d-btn" onClick={(e) => downloadImage(e, post.image, post.message)}>
                                                        download
                                                    </span></a>
                                                    <p className="pe-1 fw-bold">{post.name}</p>
                                                </div>
                                            </div>}
                                        </div>
                                    ))
                                    :posts.map((post) => (
                                        <div className="post" onMouseEnter={() => handleMouseEnter(post._id)} onMouseLeave={handleMouseLeave}>
                                            <img src={post.image} className="post-img" />
                                            {show && showPrompt == post._id && <div className="prompt-container bg-white">
                                                {showPrompt === post._id && <p className="prompt-msg">{post.message}</p>}
                                                <div className="d-flex justify-content-between">
                                                    <a href="" className="download-link"><span class="material-symbols-outlined d-btn" onClick={(e) => downloadImage(e, post.image, post.message)}>
                                                        download
                                                    </span></a>
                                                    <p className="pe-1 fw-bold">{post.name}</p>
                                                </div>
                                            </div>}
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Community;