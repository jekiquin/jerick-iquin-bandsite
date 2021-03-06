/*
createElement:
Description: Creates an element, adds attributes to the element and then appends created element to the parent container
Parameters:
    - element: element tag that needs to be created
    - parent: container where the element tag is to be appended
    - elementAttributes: element attributes (eg. classList, innerText, src, etc)
    - append:
        true: append element
        false: prepend element
Return Value:
    - created element object
*/
export function createElement(element, parent='document', elementAttributes={}, append = true) {
    const elementObj = document.createElement(element);
    for (let attribute in elementAttributes) {
        if (attribute === 'classList') {
            let listOfClasses = elementAttributes[attribute];
            listOfClasses.forEach(classId => {
                elementObj[attribute].add(classId);
            });
        } else {
            elementObj[attribute] = elementAttributes[attribute];
        }
    }
    if (append) {
        parent.appendChild(elementObj);
    } else {
        parent.prepend(elementObj);
    }
    
    return elementObj;
};

/*
properCase:
Description: Applies proper case to a word
Parameters:
    - string: word to apply proper case to
Return Value:
    - Proper case formatted version of the input word.
*/
export function properCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}

/*
properCaseAll:
Description: Applies proper case to each word
Parameters:
    - string: sentence to apply the proper case into
Return Value:
    - Proper case formatted version of the input words.
*/
export function properCaseAll(string) {
    return string.split(' ').map(word => {
        return properCase(word)
    }).join(' ');
    
}