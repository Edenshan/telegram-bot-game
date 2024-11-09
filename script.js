let selectedLevel = '';  // Difficulty level
let currentWordIndex = 0; // Index to keep track of the current word
let words = [];  // Array to store words based on selected level
let selectedGameImage = '';  // Variable to store the selected game image




// Function to start the game by showing difficulty selection
function initialStartGame() {
    console.log("Game started, showing difficulty selection.");
    document.getElementById("welcome-screen").style.display = "none";  // Hide welcome screen
    document.getElementById("difficulty-selection").style.display = "block";  // Show difficulty selection
}


// If you still want to use displayStoredImage, it should only run when you need to display the image again.
function displayStoredImage() {
    const gameImageElement = document.getElementById("game-image");
    gameImageElement.src = selectedGameImage; // Display the full path stored in selectedGameImage
    gameImageElement.style.display = "block"; // Ensure the image is visible
}

function showRandomGameImage() {
    const folderPath = './images/game_image'; // Relative path to the images folder
    const images = ["1.jpg", "2.jpg", "3.jpg"]; // List of image files
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    selectedGameImage = `${folderPath}/${selectedImage}`; // Store the full image path in the global variable

    // Log the image path to confirm it's correct
    console.log("Selected image path:", selectedGameImage);

    const gameImageElement = document.getElementById("game-image");

    // Check if the image element exists
    if (!gameImageElement) {
        console.error("Image element not found!");
        return;
    }

    // Set the image source and display it
    gameImageElement.src = selectedGameImage;
    gameImageElement.style.display = "block"; // Ensure the image is visible

    // Clear any existing hourglass containers before creating a new one
    const hourglassSection = document.getElementById("hourglass-container");
    hourglassSection.innerHTML = ""; // Clears all previous hourglass elements

    // Create the hourglass container and fill dynamically
    const hourglassContainer = document.createElement("div");
    const hourglassFill = document.createElement("div");

    // Style the hourglass container (rectangle, horizontal, green color initially)
    hourglassContainer.style.width = "100%";
    hourglassContainer.style.height = "30px";
    hourglassContainer.style.border = "1px solid #000"; // Optional: border for visibility
    hourglassContainer.style.position = "relative"; // Relative positioning for the fill

    // Style the hourglass fill (initially green)
    hourglassFill.style.width = "0%";
    hourglassFill.style.height = "100%";
    hourglassFill.style.backgroundColor = "green";

    // Append the fill inside the container
    hourglassContainer.appendChild(hourglassFill);

    // Append the hourglass container to the specific container within the HTML structure
    hourglassSection.appendChild(hourglassContainer);

    let width = 0;
    // Function to update the hourglass progress
    const updateHourglass = setInterval(() => {
        if (width >= 100) {
            clearInterval(updateHourglass);
            hourglassFill.style.backgroundColor = "grey"; // Change color to grey when time is up
        } else {
            width++;
            hourglassFill.style.width = width + "%";
        }
    }, 250); // Update every 250ms to simulate the passage of time (25 seconds = 100% in 250ms intervals)

    // Hide the image and reset after 25 seconds
    setTimeout(() => {
        gameImageElement.style.display = "none"; // Hide the image
        hourglassFill.style.width = "0%"; // Reset hourglass
        hourglassFill.style.backgroundColor = "green"; // Reset color
        showQuestionSection(hourglassFill);
    }, 25000); // Image is shown for 25 seconds

    return selectedImage; // Return the path of the selected image
}



// Show the question section after image disappears
function showQuestionSection(hourglassFill) {
    document.getElementById("game-image").style.display = "none";
    hourglassFill.style.width = "0%"; // Reset hourglass
    hourglassFill.style.backgroundColor = "green"; // Reset color

    // Show the Next Question button and load questions
    document.getElementById("next-question-button").style.display = "inline-block";
    displayQuestionsForImage();
}

// Load and display questions based on selected level and image
function displayQuestionsForImage() {
    if (!selectedGameImage || !selectedLevel) {
        console.error("Selected game image or level is missing.");
        return;
    }

    const filePath = `data/question_${selectedLevel}.text`;

    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            return response.text();
        })
        .then(text => {
            const questions = parseQuestions(text).filter(q => q.image === selectedGameImage);

            if (questions.length === 0) {
                alert("No questions found for the selected image.");
                return;
            }

            // Display questions sequentially
            showQuestionsSequentially(questions);
        })
        .catch(error => {
            console.error("Error fetching question file:", error);
            alert("Failed to load questions for the selected level.");
        });
}

// Parse questions from text
function parseQuestions(text) {
    const lines = text.trim().split('\n');
    return lines.map(line => {
        const [image, pinyinQuestion, chineseQuestion] = line.split(',');
        return { image, pinyinQuestion, chineseQuestion };
    });
}

// Display questions sequentially
let questionIndex = 0;
let questions = [];

function showQuestionsSequentially(loadedQuestions) {
    questions = loadedQuestions;
    questionIndex = 0;
    showNextQuestion();
}

// Show the current question and update button to advance
function showNextQuestion() {
    if (questionIndex < questions.length) {
        const question = questions[questionIndex];
        document.getElementById("question-pinyin").textContent = question.pinyinQuestion;
        document.getElementById("question-chinese").textContent = question.chineseQuestion;
        questionIndex++;
    } else {
        document.getElementById("question-pinyin").textContent = "";
        document.getElementById("question-chinese").textContent = "All questions have been displayed.";
        document.getElementById("next-question-button").style.display = "none";
    }
}


// Function to start learning words based on selected level and image
function startLearningWords() {
    console.log("Learning session started");




    // Check if the selected level is valid
    if (!selectedLevel) {
        alert("Please select a difficulty level first.");
        return;
    }
   
    if (!selectedGameImage) {
        alert("No image selected for the learning session.");
        return;
    }




    // Determine the file path based on the selected level
    const filePath = `data/${selectedLevel}.text`;




    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
            }
            return response.text(); // Get the text content of the file
        })
        .then(text => {
            words = parseWords(text);  // Parse and store words in the array
            currentWordIndex = 0;  // Reset to the first word




            // Filter the words based on the selected image
            const filteredWords = words.filter(word => word.image === selectedGameImage);




            if (filteredWords.length === 0) {
                alert("No words found for the selected image.");
                return;
            }




            // Display the first word that matches the selected image
            displayWord(filteredWords[currentWordIndex]);




            // Show the learning session and hide other sections
            document.getElementById("learning-session").style.display = "block";
            document.getElementById("post-welcome-options").style.display = "none";
        })
        .catch(error => {
            console.error("Error fetching file:", error);
            alert("Failed to load words for the selected level.");
        });
}




// Function to parse words from the file text
function parseWords(text) {
    const lines = text.trim().split('\n');  // Split the text into lines
    return lines.map(line => {
        const [image, chinese, pinyin, english] = line.split(',');
        return { image, chinese, pinyin, english };
    });
}




// Function to display the word details and corresponding image
function displayWord(word) {
    // Use the English word to find the corresponding image
    const imageName = word.english.toLowerCase() + '.jpg';  // Use the English word (lowercased) to create the image filename
    const imagePath = `images/${selectedLevel}/${imageName}`;  // Image path using the selected level and image name




    console.log(`Displaying image: ${imagePath}`);  // Debugging log to see the image path




    // Set image source and other word details
    document.getElementById("word-image").src = imagePath;
    document.getElementById("word-image").alt = word.chinese;
    document.getElementById("word-chinese").textContent = `Chinese: ${word.chinese}`;
    document.getElementById("word-pinyin").textContent = `Pinyin: ${word.pinyin}`;
    document.getElementById("word-english").textContent = `English: ${word.english}`;
    document.getElementById("word-audio").innerHTML = `
        <source src="audio/${word.image.replace('.jpg', '')}.mp3" type="audio/mp3">
    `;
}




// Function to handle "Next" button click
function nextWord() {
    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        displayWord(words[currentWordIndex]);
    }
}




// Function to handle "Previous" button click
function prevWord() {
    if (currentWordIndex > 0) {
        currentWordIndex--;
        displayWord(words[currentWordIndex]);
    }
}




// Function to set difficulty level
function setDifficulty(level) {
    console.log(`Difficulty set to Level ${level}`);
    switch (level) {
        case 1:
            selectedLevel = 'basic';
            break;
        case 2:
            selectedLevel = 'medium';
            break;
        case 3:
            selectedLevel = 'intermediate';
            break;
        default:
            console.warn("Invalid level selected");
            return;
    }


    // Only select and store a random image if it hasn't been selected yet
    if (!selectedGameImage) {
        selectedGameImage = showRandomGameImage(); // Store the selected image
    } else {
        displayStoredImage(); // Display the already selected image
    }
    // Hide difficulty selection and show options to proceed
    document.getElementById("difficulty-selection").style.display = "none";
    document.getElementById("post-welcome-options").style.display = "block";
}




// Function to skip learning session and start the game
function skipLearningAndStartGame() {
    console.log("Skipping learning session and starting the game.");

    // Hide the learning session and post-welcome options
    document.getElementById("learning-session").style.display = "none";
    document.getElementById("post-welcome-options").style.display = "none";

    // Show the game session
    document.getElementById("game-session").style.display = "block";

    // No need to call displayStoredImage here if showRandomGameImage already set the image
    // displayStoredImage(); // This is redundant and unnecessary
}



// Initialize event listeners on page load
function initialize() {
    document.getElementById("start-game-button").addEventListener("click", initialStartGame);
    document.getElementById("learn-words-button").addEventListener("click", startLearningWords);
    document.getElementById("start-game-from-learning-button").addEventListener("click", skipLearningAndStartGame);
}




window.onload = initialize;
