export function createElement(element, parent='document', elementAttributes={}) {
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
    parent.appendChild(elementObj);
    return elementObj;
};

export function capitalize(string) {
    return string[0].toUpperCase() + string.slice(1);
}