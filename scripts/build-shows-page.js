import { createElement, capitalize } from './peripherals.js';

// query selectors
const showsContainer = document.querySelector('.shows');

// showsdata
const showsData = [
    {
        date: new Date('September 06, 2021'),
        venue: 'Ronald Lane',
        location: 'San Francisco, CA'
    },
    {
        date: new Date('September 21, 2021'),
        venue: 'Pier 3 East',
        location: 'San Francisco, CA'
    },
    {
        date: new Date('October 15, 2021'),
        venue: 'View Lounge',
        location: 'San Francisco, CA'
    },
    {
        date: new Date('November 06, 2021'),
        venue: 'Hyatt Agency',
        location: 'San Francisco, CA'
    },
    {
        date: new Date('November 26, 2021'),
        venue: 'Moscow Center',
        location: 'San Francisco, CA'
    },
    {
        date: new Date('December 15, 2021'),
        venue: 'Press Club',
        location: 'San Francisco, CA'
    }
];

function generateShowDetail(showDetail, showsList) { 
    // create list elements tag
    const showArticle = createElement(
        'li',
        showsList,
        {classList: ['shows__item']}
    );


    for (let detail in showDetail) {
        // create container tag
        let container = createElement(
            'div',
            showArticle,
            {classList: [`shows__ctx-container`]}
        )

        // create labels
        createElement(
            'p',
            container,
            {
                classList: ['shows__detail', 'shows__detail--label'],
                innerText: detail.toUpperCase()
            }
        );

        let detailAttribute = {
            classList: ['shows__detail', `shows__detail--${detail}`],
        }
        if (detail === 'date') {
            detailAttribute.innerText = showDetail[detail].toDateString();
        } else {
            detailAttribute.innerText = capitalize(showDetail[detail])
        }

        // create the details
        createElement(
            'p',
            container,
            detailAttribute
        )
    }

    let buttonAttribute = {
        classList: ['cta-button', 'cta-button--shows'],
        innerText: 'BUY TICKETS'
    }

    // create button
    let cta = createElement(
        'button',
        showArticle,
        buttonAttribute
    );
    
    cta.addEventListener('click', () => {
        console.log(`Venue: ${showDetail.venue}, ${showDetail.location}`);
    })

    return showArticle;
};


function generateShowsList(dataList) {
    
    createElement(
        'h2',
        showsContainer,
        {
            classList: ['shows__header'],
            innerText: 'Shows'
        }
    );

    const showsList = createElement(
        'ul',
        showsContainer,
        {
            classList: ['shows__list']
        }
    );

    dataList.forEach((data, idx) => {
        let showsCard = generateShowDetail(data, showsList);
        if (idx) {
            let labels = showsCard.querySelectorAll('.shows__detail--label');
            for (let label of labels) {
                label.classList.add('shows__detail--hidden');
            }
        }
    })
};

generateShowsList(showsData);