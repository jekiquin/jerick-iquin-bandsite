// import peripheral functions
import { createElement, properCaseAll} from './peripherals.js';

// api information
const endpoint = 'https://project-1-api.herokuapp.com/comments';
const apiKey = 'ea5744a6-ad19-4c05-b800-9fe8ec7ba912';

const commentsSection = document.querySelector('.comments__limiting-container');
const commentForm = document.querySelector('.comments__form');

// grabbing all the input fields for blur even listener
const formInputs = document.querySelectorAll('.comments__form-input')

// conatiner for posted comments
const postContainer = createElement(
    'div',
    commentsSection,
    {
        classList: ['comments__posts-container']
    }
)

createElement(
    'h3',
    postContainer,
    {
        innerText: 'Loading all comments...',
        classList: ['comments__loading']
    }
)

class Comments {
    constructor(endpoint, apiKey) {
        this._allComments = [];
        this._endPoint = endpoint;
        this._apiKey = apiKey;
    }

    get allComments() {
        const sorted = JSON.parse(JSON.stringify(this._allComments));
        sorted.sort((comment1, comment2) => {
            return comment2.timestamp - comment1.timestamp;
        });
        return sorted;
    }

    fetchComments() {
        const getConfig = {
            method: "GET",
            url: `${this._endPoint}?api_key=${this._apiKey}`,
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
            url:`${this._endPoint}?api_key=${this._apiKey}`,
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
    addLike(id) {
        const putConfig = {
            method: "PUT",
            url: `${this._endPoint}/${id}/like?api_key=${this._apiKey}`,
        }
        return (
            axios(putConfig)
                .then(() => {
                   return this.fetchComments();
                })
        )
    }

    deleteComment(id) {
        const deleteConfig = {
            method: "DELETE",
            url: `${this._endPoint}/${id}?api_key=${this._apiKey}`,
        }
        return (
            axios(deleteConfig)
                .then(() => {
                    return this.fetchComments();
                })
        )
    }
}

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
    generateButtons(commentObj, ctxContainer)
    
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

function generateButtons(commentObj, cardContainer) {
    const buttonsContainer = createElement(
        'div',
        cardContainer,
        {
            classList: ['comments__card-button-container']
        }
    )

    const likeButton = createElement(
        'img',
        buttonsContainer,
        {
            classList: ['comments__card-button', 'comments__card-button--like'],
            src: './assets/icons/icon-like.svg',
            alt: 'Like!'
        }
    )

    likeEvent(likeButton, commentObj.id);

    createElement(
        'p',
        buttonsContainer,
        {
            classList: ['comments__card-counter'],
            innerText: commentObj.likes
        }
    )

    const deleteButton = createElement(
        'img',
        buttonsContainer,
        {
            classList: ['comments__card-button', 'comments__card-button--delete'],
            src: './assets/icons/icon-delete.svg',
            alt: 'Delete!'
        }
    )

    deleteEvent(deleteButton, commentObj.id);
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
    commentsList.forEach(post => {
        displayComment(post);
    })
}

function renderAllComments(commentsList) {
    postContainer.innerHTML = '';
    postAllComments(commentsList);
}

function inputBlurEventHandler(eventTarget) {
    if (eventTarget.value.trim() === '') {
        eventTarget.classList.add('comments__form-input--error');
    } else {
        eventTarget.classList.remove('comments__form-input--error');
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

    const timeNow = new Date().getTime();
    const posted = new Date(postedTime).getTime();
    const timeDiff = timeNow - posted;
    let timeMessage = 'Posted just now.';
    for (let dateKey in MILLISECONDS_CONVERTER) {
        const timeConvertFloor = Math.floor(timeDiff / MILLISECONDS_CONVERTER[dateKey]);
        const timeConvertRound = Math.round(timeDiff / MILLISECONDS_CONVERTER[dateKey]);
        if (timeConvertFloor > 0) {
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
/* ----- event listener ------ */
// input field blur event listener
function likeEvent(likeButton, id) {
    likeButton.addEventListener('click', event => {
        bioPage.addLike(id)
            .then(() => {
            renderAllComments(bioPage.allComments);
            })
    })
}

function deleteEvent(deleteButton, id) {
    deleteButton.addEventListener('click', event => {
        bioPage.deleteComment(id)
        .then(() => {
            renderAllComments(bioPage.allComments);
        }) 
    })
}

formInputs.forEach(formInput => {
    formInput.addEventListener('blur', (event) => {
        inputBlurEventHandler(event.target);
    })
});

// form event listener
commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputName = properCaseAll(event.target.name.value.trim());
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
        comment: inputComment,
    };

    event.target.reset();
    
    bioPage.postComment(commentObj)
        .then(() => {
            renderAllComments(bioPage.allComments);
        })
})

/* ----- Document on load ------ */
const bioPage = new Comments(endpoint, apiKey);

bioPage.fetchComments()
    .then(() => {
        renderAllComments(bioPage.allComments);
    })
