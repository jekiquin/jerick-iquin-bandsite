// import peripheral functions
import { createElement, capitalize } from './peripherals.js';

// api information
const endpoint = 'https://project-1-api.herokuapp.com/comments';
const apiKey = 'ea5744a6-ad19-4c05-b800-9fe8ec7ba912';
const url = `${endpoint}?api_key=${apiKey}`;

// comments list declaration
let commentsList = [];

const commentsSection = document.querySelector('.comments__limiting-container');
const commentForm = document.querySelector('.comments__form');
const profileImage = document.querySelector('.comments__form-profile');

// grabbing all the input fields for blur even listener
const formInputs = document.querySelectorAll('.comments__form-input')

const postContainer = document.createElement('div');
commentsSection.appendChild(postContainer);

class Comments {
    constructor(url) {
        this._allComments = [];
        this._endPoint = url;
    }

    get allComments() {
        const toSort = JSON.parse(JSON.stringify(this._allComments));
        toSort.sort((comment1, comment2) => {
            return comment2.timestamp - comment1.timestamp;
        });
        return toSort;
    }

    fetchComments() {
        const getConfig = {
            method: "GET",
            url: this._endPoint,
        }
        return (
            axios(getConfig)
                .then((res) => {
                    this._allComments = res.data;
            })
        )
    }

    postComment(commentObj) {
        const postConfig = {
            method: "POST",
            url: this._endPoint,
            header: {
                'Content-Type': 'application/json'
            },
            data: commentObj
        }
        return (
            axios(postConfig)
                .then(() => {
                    return this.fetchComments();
                })
                .catch(err => {
                    console.log(err);
                })
        ) 
    }
}

// data with defaults
// const commentsList = [
//     {
//         name: 'Miles Acosta',
//         timestamp: new Date('December 20, 2020'),
//         comment: "I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.",
//         image: null
//     },
//     {
//         name: 'Emilie Beach',
//         timestamp: new Date('January, 09, 2021'),
//         comment: 'I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.',
//         image: null
//     },
//     {
//         name: 'Connor Walton',
//         timestamp: new Date('February 17, 2021'),
//         comment: 'This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.',
//         image: null
//     }
// ];

function generateCommentCtx(commentObj, cardContainer) {
    const ctxContainer = createElement(
        'div',
        cardContainer,
        {
            classList: ['comments__card-ctx']
        }
    );

    const nameDateContainer = createElement(
        'div',
        ctxContainer,
        {
            classList: ['comments__card-name-date']
        }
    );

    createElement(
        'p',
        nameDateContainer,
        {
            classList: ['comments__card-name'],
            innerText: commentObj.name
        }
    );

    createElement(
        'p',
        nameDateContainer,
        {
            classList: ['comments__card-date'],
            innerText: new Date(commentObj.timestamp).toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
        }
    );

    createElement(
        'p',
        ctxContainer,
        {
            classList: ['comments__card-text'],
            innerText: commentObj.comment
        }
    );

    generateTimeDiff(commentObj, ctxContainer);

}

function generateCommentProfilePic(commentObj, cardContainer) {
    if (commentObj.image) {
        createElement(
            'img',
            cardContainer,
            {
                classList: ['comments__card-image'],
                src: commentObj.image,
                alt: `${commentObj.name} profile`
            }
        )
    } else {
        createElement(
            'div',
            cardContainer,
            {
                classList: ['comments__card-image']
            }
        )
    }

}

function generateTimeDiffMessage(postedTime) {
    const MILLISECONDS_CONVERTER = {
        year: 1000*60*60*24*30*12,
        month: 1000*60*60*24*30,
        day: 1000*60*60*24,
        hour: 1000*60*60,
        minute: 1000*60,
    };

    const timeNow = new Date();
    const timeDiff = timeNow.getTime() - new Date(postedTime).getTime();

    let timeMessage = 'Posted just now.';
    for (let dateKey in MILLISECONDS_CONVERTER) {
        const timeConvertFloor = Math.floor(timeDiff / MILLISECONDS_CONVERTER[dateKey]);
        const timeConvertRound = Math.round(timeDiff / MILLISECONDS_CONVERTER[dateKey]);
        if (timeConvertFloor) {
            timeMessage = `Posted ${timeConvertRound} `;
            timeMessage += timeConvertRound > 1 ? `${dateKey}s ago.` : `${dateKey} ago.`;
            break;
        }
    }
    return(timeMessage);
}

function generateTimeDiff(commentObj, cardContainer){
    const timeMessage = generateTimeDiffMessage(commentObj.timestamp);

    createElement(
        'p',
        cardContainer,
        {
            classList: ['comments__card-date', 'comments__card-date--diff'],
            innerText: timeMessage
        }
    )

}

function displayComment(commentObj) {
    const cardContainer = createElement(
        'article',
        postContainer,
        {
            classList: ['comments__card']
        }
    );

    generateCommentProfilePic(commentObj, cardContainer);
    generateCommentCtx(commentObj, cardContainer);
}

function postAllComments(commentsList) {
    // commentsList.sort((comment1, comment2) => {
    //     return comment2.timestamp - comment1.timestamp
    // })
    console.log(commentsList);
    commentsList.forEach(post => {
        displayComment(post);
    })
}

function inputBlurEventHandler(eventTarget) {
    if (eventTarget.value.trim() === '') {
        eventTarget.classList.add('comments__form-input--error');
    } else {
        eventTarget.classList.remove('comments__form-input--error');
    }
}

/* ----- event listener ------ */
// input field blur event listener
formInputs.forEach(formInput => {
    formInput.addEventListener('blur', (event) => {
        inputBlurEventHandler(event.target);
    })
});

// form event listener
commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputName = event.target.name.value.trim();
    const inputComment = event.target.comment.value.trim();

    // first error handling. checking blank inputs
    if (inputName === '') {
        inputBlurEventHandler(event.target.name);
        return;
    }
    if (inputComment === ''){
        inputBlurEventHandler(event.target.name);
        return;
    }

    const commentObj = {
        name: inputName,
        // timestamp: new Date(),
        comment: inputComment,
        // image: profileImage.src
    };

    event.target.reset();
    // commentsList.push(commentObj);
    

    bioPage.postComment(commentObj)
        .then(() => {
            postContainer.innerHTML = '';
            postAllComments(bioPage.allComments);
        })
})

/* ----- Document on load ------ */
const bioPage = new Comments(url);

bioPage.fetchComments()
    .then(() => {
        postAllComments(bioPage.allComments);
    })
