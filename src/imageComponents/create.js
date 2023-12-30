import { useState } from "react";
import openai from "../images/openai.svg";
import preview from "../images/preview.png";
import { useNavigate } from "react-router-dom";

function CreateImage() {
    let navigate = useNavigate();
    let [spin, setSpin] = useState(false);
    let [button, setbutton] = useState("Generate");
    let [name, setName] = useState("");
    let [prompt, setPrompt] = useState("");
    let [image, setImage] = useState("");
    let [share, setShare] = useState("Share with community");
    let [rawImage, setRawImage] = useState("");
    let [showBtn, setShowBtn] = useState(false);
    let [loadCommunity, setLoadCommunity] = useState(false);

    function getRandomtext() {
        let ind = Math.floor(Math.random() * prompts.length);
        if(prompt===prompts[ind]){
            getRandomtext();
        }
        else{
            setPrompt(prompts[ind]);
        }

    }

    function handleChange(e) {
        setPrompt(e.target.value);
    }

    async function generateImage(e) {
        e.preventDefault();
        if (name.length === 0) {
            alert("Name field cannot be empty");
        }
        else if (prompt.length === 0) {
            alert("Prompt field cannot be empty");
        }
        else {
            try {
                let obj = {
                    name: name,
                    message: prompt
                };
                setSpin(true);
                setbutton("Generating....")
                let imageDiv = document.querySelector(".preview");
                imageDiv.style.opacity = 0.3;
                let getImage = await fetch("https://dall-e-backend-3wtv.onrender.com/api/dalle/image/generate", {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {
                        "content-type": "application/json"
                    }
                })
                let genereatedResponse = await getImage.json();
                setRawImage(genereatedResponse.img);
                setImage(`data:image/jpeg;base64,${genereatedResponse.img}`);
                imageDiv.src = `data:image/jpeg;base64,${genereatedResponse.img}`;
                setShowBtn(true);
                setLoadCommunity(true);
            }
            catch (error) {
                console.log(error);
            }
            finally {
                setSpin(false);
                let imageDiv = document.querySelector(".preview");
                imageDiv.style.opacity = 1;
                setbutton("Generate");
            }
        }
    }
    async function shareTocommunity() {
        if (!loadCommunity) {
            alert("Generate image before share with community post")
        }
        else {
            try {

                setShare("Sharing....");
                let obj = {
                    name: name,
                    prompt,
                    photo: image
                };
                let uploadToCloud = await fetch("https://dall-e-backend-3wtv.onrender.com/api/post/update", {
                    method: "POST",
                    body: JSON.stringify(obj),
                    headers: {
                        "content-type": "application/json"
                    }
                });
                let result = await uploadToCloud.json();
                if (result.msg) {
                    setShare("Posted")
                    navigate("/community/posts")
                }
            } catch (error) {
                console.log(error);
            }
            finally {
                setShare("Share with community")
            }
        }
    }

    async function downloadImage(e) {
        e.preventDefault();
        let blob = await fetch(`data:image/jpeg;base64,${rawImage}`).then((res) => res.blob());
        let blobUrl = window.URL.createObjectURL(blob);
        let link = document.querySelector(".download-link");
        link.href = blobUrl;
        link.download = `dalle-${prompt}`;
        link.click();
        window.URL.revokeObjectURL(blobUrl);

    }
    return (
        <div className="create-image-div">
            <div className="container mt-3 mb-4">
                <div className="row">
                    <div className="col-md-12 col-lg-8 mx-auto">
                        <div className="nav-bar d-flex justify-content-between">
                            <div className="logo">
                                <img src={openai} className="logo-img" alt="logo"/>
                                <span className="fw-bolder">OpenAI</span>
                            </div>
                            <div className="nav-btn">
                                <button className="comm-btn" onClick={() => navigate("/community/posts")}>Community</button>
                            </div>
                        </div>
                        <div className="main">
                            <div className="mt-3">
                                <p className="post-text mt-5 mb-1">Create post</p>
                                <p className="descrip">Experience the magic of DALL-E with Imaginify—an AI-driven image generator. Describe your vision, customize with ease, and let DALL-E bring your ideas to life in high-resolution brilliance.</p>
                            </div>
                        </div>

                        <div className="form">
                            <div className="post-text1 mt-5 mb-1">Name</div>
                            <div>
                                <input type="text" placeholder="Enter your name" className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required />
                            </div>
                        </div>
                        <div className="form">
                            <div className="post-text1 mt-5 mb-2">Prompt<span className="ms-2"><button className="btn text-dark rounded border-dark" onClick={getRandomtext}>Surprise me</button></span></div>
                            <div>
                                <input type="text" placeholder="Enter message to generate image" className="form-control"
                                    value={prompt}
                                    onChange={handleChange}
                                    required />
                            </div>
                        </div>
                        <div className="image-preview">
                            <div className="post-text1 mt-5">Preview</div>
                            <div className="img-preview">
                                <img src={preview} className="preview" alt="generated image" />
                                {spin && <div className="spinner">
                                    <div class="spinner-border text-dark" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                                {showBtn && <a href="" className="download-link"><span className="material-symbols-outlined d-btn align-bottom" onClick={(e) => downloadImage(e, image)}>
                                    download
                                </span></a>}
                            </div>
                        </div>
                        <div className="generate-btn row mt-2">
                            <button className="btn bg-success text-white col-md-2 col-10 ms-2" onClick={generateImage}>{button}</button>
                        </div>


                        <div className="form mt-4">
                            {/* <p className="post-text1 mt-5 mb-2">Prompt<span className="ms-2"><button className="btn text-dark rounded border-dark">Surprise me</button></span></div> */}
                            <p className="descrip ms-1">Once you have created the image, you can share it with others in the community. Others can see your image and they can download it.</p>
                        </div>
                        
                            <div className="generate-btn row mt-4">
                                <button className="comm-btn col-md-4 col-10 ms-2" onClick={shareTocommunity}>{share}</button>
                            </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default CreateImage;



const prompts = [
    "A surreal desert oasis with floating water droplets.",
    "A cityscape on the back of a giant moving creature.",
    "A garden of giant, bioluminescent flowers at night.",
    "A journey through the inside of a clockwork mechanism.",
    "A cosmic library with books made of stardust.",
    "A swarm of fireflies creating a mesmerizing light show.",
    "A mystical portal opening in the middle of a meadow.",
    "A fleet of space taxis in a busy intergalactic city.",
    "A rainforest with oversized, neon-colored insects.",
    "A sunset over a tranquil lake surrounded by ancient ruins.",
    "A colony of floating islands inhabited by winged creatures.",
    "A field of talking mushrooms sharing ancient stories.",
    "A fantastical roller coaster in the clouds with loop-de-loops.",
    "A magical potion shop with bottles containing swirling galaxies.",
    "A crystalline cavern with glowing crystals of various colors.",
    "A group of friendly robots playing musical instruments.",
    "A futuristic train station with levitating trains.",
    "A parade of fantastical creatures through a medieval town.",
    "A time traveler's meeting point with portals to different eras.",
    "An alien bazaar with unique artifacts from across the universe.",
    "A wizard's laboratory with bubbling potions and magical books.",
    "A surreal chessboard where pieces come to life.",
    "A cosmic dance party with planets as disco balls.",
    "A garden of floating islands with gravity-defying flora.",
    "An underwater city with transparent domes and marine life.",
    "A group of astronauts exploring a crystalline asteroid.",
    "A forest where the trees are made of flowing water.",
    "A futuristic skateboard park in zero gravity.",
    "A group of skydivers soaring through a neon-lit canyon.",
    "A secret underwater society of mermaids and mermen.",
    "A city skyline with buildings shaped like giant instruments.",
    "A parade of hot air balloons in a surreal sky.",
    "An ancient coliseum where mythical creatures compete.",
    "A cosmic carnival with rides powered by starlight.",
    "A floating city with balloons and airships.",
    "A garden of animated plants that respond to music.",
    "A celestial observatory with telescopes observing galaxies.",
    "A group of fairies casting spells in a moonlit forest.",
    "A journey through a rainbow-colored wormhole.",
    "An alien sports arena with intergalactic competitions.",
    "A futuristic farm with robotic animals and high-tech crops.",
    "A cityscape where buildings are shaped like giant crystals.",
    "An underwater cave with bioluminescent sea creatures.",
    "A futuristic race track with anti-gravity vehicles.",
    "A library of dreams where each book represents a different dream.",
    "A city where the streets are made of liquid light.",
    "A surreal marketplace with floating fruit and vegetable vendors.",
    "A futuristic cityscape with flying cars and skyscrapers.",
    "A mysterious forest with glowing butterflies and hidden doorways.",
    "Underwater world with bioluminescent creatures and ancient ruins.",
    "A steampunk-inspired airship navigating through stormy clouds.",
    "Robotics factory with assembly lines and futuristic machinery.",
    "Enchanted garden with talking animals and floating flowers.",
    "Space exploration with astronauts and alien landscapes.",
    "Time-traveling journey through historical landmarks.",
    "A cybernetic creature in a digital landscape.",
    "Magical library with books that come to life.",
    "City skyline at sunset with vibrant colors and reflections.",
    "Exploration of a distant planet with unique flora and fauna.",
    "A journey through a wormhole in deep space.",
    "Surreal desert landscape with floating rocks and mirages.",
    "Ancient temple hidden in the heart of the jungle.",
    "Futuristic underwater city with transparent domes.",
    "A whimsical circus with acrobats and mythical animals.",
    "Night sky filled with constellations and shooting stars.",
    "A giant treehouse in a mystical forest.",
    "Dystopian cityscape with neon lights and dark alleyways.",
    "A magical kingdom in the clouds with flying islands.",
    "Mechanical dragon guarding a treasure in a cave.",
    "Floating islands in a serene sky with waterfalls.",
    "Virtual reality world with holographic landscapes.",
    "Journey through a portal to parallel universes.",
    "Fire-breathing phoenix rising from the ashes.",
    "Exploration of a frozen tundra with ice sculptures.",
    "A labyrinthine maze with optical illusions.",
    "Skydiving adventure through colorful clouds.",
    "Robotic bee pollinating futuristic flowers.",
    "A space station orbiting a distant planet.",
    "A dreamy landscape inspired by abstract art.",
    "A cosmic ballet of planets and celestial bodies.",
    "A secret garden with glowing mushrooms and fairies.",
    "A floating market in a bustling celestial city.",
    "A journey inside a kaleidoscope of colors.",
    "A surreal carnival with twisted architecture.",
    "Biomechanical creatures in an alien ecosystem.",
    "A city made of crystal with reflections and refractions.",
    "A time-traveling train speeding through different eras.",
    "An intergalactic marketplace with diverse alien species.",
    "A rainbow bridge connecting two magical realms.",
    "A sunken city with aquatic life and ancient architecture.",
    "A cosmic painter creating galaxies with a celestial brush.",
    "A parallel universe where gravity works differently.",
    "A mystical ritual under the light of a full moon."
];
