// import peripheral functions
import { createElement, capitalize } from './peripherals.js';

const commentsSection = document.querySelector('.comments__limiting-container');

const defaultComments = [
    {
        name: 'Connor Walton',
        date: new Date('February 17, 2021'),
        comment: 'This is art. This is inexplicable magic expressed in the purest way, everything that makes up this majestic work deserves reverence. Let us appreciate this for what it is and what it contains.',
        image: null
    },
    {
        name: 'Emilie Beach',
        date: new Date('January, 09, 2021'),
        comment: 'I feel blessed to have seen them in person. What a show! They were just perfection. If there was one day of my life I could relive, this would be it. What an incredible day.',
        image: null
    },
    {
        name: 'Miles Acosta',
        date: new Date('December 20, 2020'),
        comment: "I can't stop listening. Every time I hear one of their songs - the vocals - it gives me goosebumps. Shivers straight down my spine. What a beautiful expression of creativity. Can't get enough.",
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
        commentsSection,
        {
            classList: ['comments__card']
        }
    );

    generateCommentProfilePic(commentObj, cardContainer);
    generateCommentCtx(commentObj, cardContainer);

}

function initializePostedComments() {
    defaultComments.forEach(post => {
        displayComment(post);
    })
}



// on document load
initializePostedComments();

