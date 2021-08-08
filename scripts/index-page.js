// import peripheral functions
import { createElement, capitalize } from './peripherals.js';

const commentsSection = document.querySelector('.comments__limiting-container');
const commentForm = document.querySelector('.comments__form');
const profileImage = document.querySelector('.comments__form-profile');

// grabbing all the input fields
const formChildren = commentForm.children;
const formInputs = Array.prototype.filter.call(formChildren, child => {
    return (child.classList.contains('comments__form-input'));
})


const postContainer = document.createElement('div');
commentsSection.appendChild(postContainer);

// data with defaults
const commentsList = [
    {
        name: 'Miles Acosta',
        date: new Date('December 20, 2020'),
        comment: "I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.",
        image: null
    },
    {
        name: 'Emilie Beach',
        date: new Date('January, 09, 2021'),
        comment: 'I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.',
        image: null
    },
    {
        name: 'Connor Walton',
        date: new Date('February 17, 2021'),
        comment: 'This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.',
        image: null
    }
];

function generateCommentCtx(commentObj, cardContainer) {
    const ctxCOntainer = createElement(
        'div',
        cardContainer,
        {
            classList: ['comments__card-ctx']
        }
    );

    const nameDateContainer = createElement(
        'div',
        ctxCOntainer,
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
            innerText: commentObj.date.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
        }
    );

    createElement(
        'p',
        ctxCOntainer,
        {
            classList: ['comments__card-text'],
            innerText: commentObj.comment
        }
    );

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

function displayComment(commentObj) {
    const cardContainer = createElement(
        'article',
        postContainer,
        {
            classList: ['comments__card']
        },
        false
    );

    generateCommentProfilePic(commentObj, cardContainer);
    generateCommentCtx(commentObj, cardContainer);

}

function postAllComments() {
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

function updateCommentsList(newCommentObj) {
    commentsList.push(newCommentObj);
    commentsList.sort((comment1, comment2) => {
        return comment1.date - comment2.date
    })
};

function removeChildNodes(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


/* ----- event listener ------ */
formInputs.forEach(formInput => {
    formInput.addEventListener('blur', (event) => {
        inputBlurEventHandler(event.target);
    })
});

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
        date: new Date(Date.now()),
        comment: inputComment,
        image: profileImage.src
    };

    updateCommentsList(commentObj);
    removeChildNodes(postContainer)
    postAllComments();
    console.log(commentsList);
    event.target.reset();
})

/* ----- Document on load ------ */
postAllComments();