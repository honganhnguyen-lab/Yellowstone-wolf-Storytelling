
let Current_Question = 0;
let user_Responses = [];
let user_Demographic = "";
function create_Quiz() {
    const Quiz_Container = document.getElementById('quiz-container');
    if (!Quiz_Container) return;
    
  //Quiz Questions 
    const questions = [
        {
            question: "When you think about wolves in the wild, what's your first emotional reaction?",
            options: [
                { text: "Excitement and fascination", score: 10 },
                { text: "Appreciation for their ecological role", score: 8 },
                { text: "A mix of respect and caution", score: 6 },
                { text: "Some concern about safety", score: 3 },
                { text: "Worry about potential threats", score: 1 }
            ]
        },
        {
            question: "How do you feel about wolf reintroduction programs?",
            options: [
                { text: "Strongly support them", score: 10 },
                { text: "Generally support with proper management", score: 8 },
                { text: "Neutral - depends on the specific circumstances", score: 6 },
                { text: "Somewhat concerned about impacts", score: 3 },
                { text: "Opposed to reintroduction efforts", score: 1 }
            ]
        },
        {
            question: "If wolves were present in an area where you hike or camp, how would you feel?",
            options: [
                { text: "Excited at the possibility of hearing or seeing them", score: 10 },
                { text: "Fine as long as proper precautions are taken", score: 7 },
                { text: "Slightly nervous but still willing to go", score: 5 },
                { text: "Would probably choose a different location", score: 2 },
                { text: "Definitely would not go there", score: 0 }
            ]
        },
        {
            question: "What do you think is the most important factor in wolf management?",
            options: [
                { text: "Protecting wolves and their habitat", score: 10 },
                { text: "Balancing wolf conservation with human needs", score: 7 },
                { text: "Scientific monitoring and adaptive management", score: 5 },
                { text: "Protecting livestock and hunting opportunities", score: 2 },
                { text: "Strict control of wolf populations", score: 0 }
            ]
        },
        {
            question: "Where do you primarily live?",
            options: [
                { text: "Urban area", score: null, demographic: "Urban" },
                { text: "Suburban area", score: null, demographic: "Suburban" },
                { text: "Rural area", score: null, demographic: "Rural" },
                { text: "Rural area with livestock/farming", score: null, demographic: "Farming" }
            ]
        }
    ];
    
 
    //render the quiz
  
    function start_Quiz() {
  
        Quiz_Container.innerHTML = "";
        

        const header = document.createElement('h3');
        header.textContent = "What's Your Wolf Attitude?";
        header.style.textAlign = "center";
        header.style.color = "#3B6D3A";
        Quiz_Container.appendChild(header);
        

        const description = document.createElement('p');
        description.textContent = "Find out where you stand compared to different stakeholder groups in our study!";
        description.style.textAlign = "center";
        description.style.marginBottom = "2rem";
        Quiz_Container.appendChild(description);
        
 
        if (Current_Question >= questions.length) {
            show_Results();
            return;
        }
        
     
        const question_Element = document.createElement('div');
        question_Element.className = "quiz-question";
        
        const question_Text = document.createElement('p');
        question_Text.className = "question-text";
        question_Text.textContent = questions[Current_Question].question;
        question_Text.style.fontWeight = "bold";
        question_Text.style.marginBottom = "1rem";
        question_Element.appendChild(question_Text);
        
        
        const options_List = document.createElement('div');
        options_List.className = "options-list";
        

        questions[Current_Question].options.forEach((option, index) => {
            const option_Button = document.createElement('button');
            option_Button.className = "option-button";
            option_Button.textContent = option.text;
            option_Button.style.display = "block";
            option_Button.style.width = "100%";
            option_Button.style.padding = "0.8rem";
            option_Button.style.margin = "0.5rem 0";
            option_Button.style.backgroundColor = "#f8f6f2";
            option_Button.style.border = "1px solid #A7A58E";
            option_Button.style.borderRadius = "4px";
            option_Button.style.cursor = "pointer";
            option_Button.style.transition = "all 0.2s";
            option_Button.style.color = "#000000";
            
            option_Button.onmouseover = function() {
                this.style.backgroundColor = "#e6e2d9";
            };
            
            option_Button.onmouseout = function() {
                this.style.backgroundColor = "#f8f6f2";
            };
            
            option_Button.onclick = function() {
       
                if (option.demographic) {
                    user_Demographic = option.demographic;
                } else {
       
                    user_Responses.push(option.score);
                }
                
     
                Current_Question++;
                start_Quiz();
                
             
                const progress_Bar = document.querySelector('.progress-fill');
                if (progress_Bar) {
                    const progress = (Current_Question / questions.length) * 100;
                    progress_Bar.style.width = `${progress}%`;
                }
            };
            
            options_List.appendChild(option_Button);
        });
        
        question_Element.appendChild(options_List);
        Quiz_Container.appendChild(question_Element);
        //progress bar

        const progress_Container = document.createElement('div');
        progress_Container.className = "progress-container";
        progress_Container.style.width = "100%";
        progress_Container.style.height = "8px";
        progress_Container.style.backgroundColor = "#e6e2d9";
        progress_Container.style.borderRadius = "4px";
        progress_Container.style.marginTop = "2rem";
        
        const progress_Fill = document.createElement('div');
        progress_Fill.className = "progress-fill";
        progress_Fill.style.width = `${(Current_Question / questions.length) * 100}%`;
        progress_Fill.style.height = "100%";
        progress_Fill.style.backgroundColor = "#3B6D3A";
        progress_Fill.style.borderRadius = "4px";
        progress_Fill.style.transition = "width 0.5s ease";
        
        progress_Container.appendChild(progress_Fill);
        Quiz_Container.appendChild(progress_Container);
    
        const counter = document.createElement('div');
        counter.className = "question-counter";
        counter.textContent = `Question ${Current_Question + 1} of ${questions.length}`;
        counter.style.textAlign = "center";
        counter.style.marginTop = "0.5rem";
        counter.style.fontSize = "0.9rem";
        counter.style.color = "#666";
        Quiz_Container.appendChild(counter);
    }
    
//display the Results
    function show_Results() {
    
        const score_Questions = questions.length - 1;
        const total_Score = user_Responses.reduce((sum, score) => sum + score, 0);
        const average_Score = total_Score / score_Questions;
        
  //calculate the percentage score
        const percentage_Score = (average_Score / 10) * 100;
        

        let attitude_Category;
        if (percentage_Score >= 75) {
            attitude_Category = "Strongly Positive";
        } else if (percentage_Score >= 60) {
            attitude_Category = "Positive";
        } else if (percentage_Score >= 40) {
            attitude_Category = "Neutral";
        } else if (percentage_Score >= 25) {
            attitude_Category = "Negative";
        } else {
            attitude_Category = "Strongly Negative";
        }
        

        let closest_Group = "";
        let closest_Score = 0;
  
        const positive_Value = percentage_Score;
        
        if (user_Demographic === "Urban") {
            closest_Group = "Urban Residents";
            closest_Score = 67;
        } else if (user_Demographic === "Rural" || user_Demographic === "Farming") {
            if (user_Demographic === "Farming") {
                closest_Group = "Farmers/Ranchers";
                closest_Score = 35;
            } else {
                closest_Group = "Rural Residents";
                closest_Score = 41;
            }
        } else {
            // find the closest group
            const groups = [
                { name: "Environmental Groups", score: 69 },
                { name: "Urban Residents", score: 67 },
                { name: "General Public", score: 61 },
                { name: "Hunters", score: 43 },
                { name: "Rural Residents", score: 41 },
                { name: "Farmers/Ranchers", score: 35 }
            ];
            
            let min_Difference = 100;
            groups.forEach(group => {
                const difference = Math.abs(group.score - positive_Value);
                if (difference < min_Difference) {
                    min_Difference = difference;
                    closest_Group = group.name;
                    closest_Score = group.score;
                }
            });
        }
        
//the container to display the Results
        const Results_Container = document.createElement('div');
        Results_Container.className = "Results-container";
        Results_Container.style.textAlign = "center";
        Results_Container.style.padding = "1rem";  
        const Results_Header = document.createElement('h3');
        Results_Header.textContent = `Your Wolf Attitude: ${attitude_Category}`;
        Results_Header.style.color = "#3B6D3A";
        Results_Header.style.marginBottom = "1rem";
        Results_Container.appendChild(Results_Header);
    
        const score_Display = document.createElement('div');
        score_Display.className = "score-display";
        score_Display.textContent = `${Math.round(positive_Value)}%`;
        score_Display.style.fontSize = "3rem";
        score_Display.style.fontWeight = "bold";
        score_Display.style.color = "#916937";
        score_Display.style.margin = "1rem 0";
        Results_Container.appendChild(score_Display);
        
        // Score label
        const score_Label = document.createElement('p');
        score_Label.textContent = "Positive Attitude Score";
        score_Label.style.marginBottom = "2rem";
        Results_Container.appendChild(score_Label);
        
        // comparable group
        const Comparison = document.createElement('p');
        Comparison.innerHTML = `Your attitudes are most similar to the <strong>${closest_Group}</strong> group (${closest_Score}% positive).`;
        Comparison.style.marginBottom = "1rem";
        Results_Container.appendChild(Comparison);
        
        // Basic descriptioss 
        const att_desc = document.createElement('p');
        if (percentage_Score >= 75) {
            att_desc.textContent = "You have a very positive view of wolves, likely valuing their ecological importance and place in natural systems.";
        } else if (percentage_Score >= 60) {
            att_desc.textContent = "You generally view wolves positively, recognizing their value while acknowledging some concerns.";
        } else if (percentage_Score >= 40) {
            att_desc.textContent = "You have a balanced view of wolves, seeing both benefits and challenges associated with their presence.";
        } else if (percentage_Score >= 25) {
            att_desc.textContent = "You have some concerns about wolves, particularly regarding potential conflicts with human activities.";
        } else {
            att_desc.textContent = "You view wolves primarily as a potential threat or problem, with significant concerns about their presence.";
        }
        att_desc.style.marginBottom = "2rem";
        Results_Container.appendChild(att_desc);
        
        // need to add social media 
        const share_Section = document.createElement('div');
        share_Section.className = "share-section";
        share_Section.style.marginTop = "1.5rem";
        
        const share_Header = document.createElement('h4');
      //  shareHeader.textContent = "Share your Resultss:";
        share_Header.style.marginBottom = "0.5rem";
        share_Section.appendChild(share_Header);
        
        const share_Buttons = document.createElement('div');
        share_Buttons.className = "share-buttons";
        share_Buttons.style.display = "flex";
        share_Buttons.style.justifyContent = "center";
        share_Buttons.style.gap = "1rem";
        
       
       
        Results_Container.appendChild(share_Section);
        
        // Restart button
        const Restart_Button = document.createElement('button');
       Restart_Button.textContent = "Take the Quiz Again";
       Restart_Button.style.marginTop = "2rem";
       Restart_Button.style.padding = "0.8rem 1.5rem";
       Restart_Button.style.backgroundColor = "#3B6D3A";
       Restart_Button.style.color = "white";
       Restart_Button.style.border = "none";
       Restart_Button.style.borderRadius = "4px";
       Restart_Button.style.cursor = "pointer";
        Restart_Button.onclick = function() {
            Current_Question = 0;
            user_Responses = [];
            user_Demographic = "";
            start_Quiz();
        };
        Results_Container.appendChild(Restart_Button);
        
        Quiz_Container.appendChild(Results_Container);
    }
    
    // Initialise the quiz
    start_Quiz();
}

// DOM Content load 
document.addEventListener("DOMContentLoaded", function() {
    // Check if quiz container exists
    const Quiz_Container = document.getElementById('quiz-container');
    if (Quiz_Container) {
        create_Quiz();
    }
});



//references
//1.https://simplestepscode.com/javascript-quiz-tutorial/
