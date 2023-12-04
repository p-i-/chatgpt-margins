const getNodeOrNull = (mutationsList) => {
    console.log('getNodeOrNull called');  // Log here
    for (const mutation of mutationsList) {
        if(mutation.addedNodes.length > 0){
            const nodes = [...document.querySelectorAll('div[data-testid^="conversation-turn-"]')];
            const lastNode = nodes.pop();
            if (lastNode && [...mutation.addedNodes].includes(lastNode)) {
                // console.log('🟢 Node found');
                return lastNode;
            }
        }
    }
    // console.log('No node found');
    return null;
};


const createUnderneathDiv = (node) => {
    const fillerDiv = document.createElement('div');
    fillerDiv.style.height = `${window.innerHeight}px`;
    console.log('Filler div height set to screen height');
    
    node.after(fillerDiv);
    console.log('Underneath div created');

    return fillerDiv;
};


// const scrollToTop = (node) => {
//     if (node) {
//         node.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         console.log('Scrolled to bring the node into view at the top.');
//     } else {
//         console.log('No node found.');
//     }
// };

const scrollToTop = (node) => {
    if (node) {
        setTimeout(() => {
            node.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('Scrolled to bring the node into view at the top.');
        }, 100);
    } else {
        console.log('No node found.');
    }
};


const isStreaming = (node) => {
    return node.querySelector('.result-streaming') !== null;
};

const checkForNewDiv = (mutationsList) => {
    const node = getNodeOrNull(mutationsList);
    if (node) {
        console.log(`Node found: ${parseInt(node.getAttribute('data-testid').split('-').pop(), 10)}`);

        const checkForStreamingClass = setInterval(() => {
            if (isStreaming(node)) {
                clearInterval(checkForStreamingClass);
                console.log('.result-streaming class found');
                let fillerDiv = createUnderneathDiv(node);
                scrollToTop(node);

                let lastSeen = Date.now();
                const checkForStreamEnd = setInterval(() => {
                    if (isStreaming(node)) {
                        lastSeen = Date.now();
                    } else if (Date.now() - lastSeen > 1000) {
                        clearInterval(checkForStreamEnd);
                        if (fillerDiv) {
                            fillerDiv.remove();
                            fillerDiv = null;
                            console.log('Filler div removed');
                        }
                    }
                }, 100);
            }
        }, 100);
    }
};


const observer = new MutationObserver(checkForNewDiv);
observer.observe(document.body, { childList: true, subtree: true });
console.log('Observer initiated');





// const createUnderneathDiv = (node) => {
//     fillerDiv = document.createElement('div');
//     document.body.after(fillerDiv);

//     const updateFillerHeight = () => {
//         fillerDiv.style.height = `${window.innerHeight - node.getBoundingClientRect().height}px`;
//         console.log('Filler div height updated');
//     };

//     updateFillerHeight();
//     node.after(fillerDiv);

//     const heightUpdateInterval = setInterval(updateFillerHeight, 100);

//     const stopUpdatingHeight = () => {
//         clearInterval(heightUpdateInterval);
//         console.log('Height update interval cleared');
//         node.removeEventListener('DOMNodeRemoved', stopUpdatingHeight);
//     };

//     node.addEventListener('DOMNodeRemoved', stopUpdatingHeight);
//     console.log('Underneath div created and height updater initiated');

//     return fillerDiv;
// };

// const scrollToTop = (node) => {
//     if (node) {
//         node.scrollIntoView({ behavior: 'smooth', block: 'start' });
//         console.log('Scrolled to bring the node into view at the top.');
//     } else {
//         console.log('No node found.');
//     }
// };

// const checkForNewDiv = (mutationsList) => {
//     for (const mutation of mutationsList) {
//         for (const node of [...mutation.addedNodes]) {
//             if (node.nodeType === 1 && node.matches('div[data-testid^="conversation-turn-"]')) {
//                 const turnNumber = parseInt(node.getAttribute('data-testid').split('-').pop(), 10);
//                 if (turnNumber % 2 !== 0) {
//                     console.log(`Odd turn div found: ${turnNumber}`);
//                     const checkForResultStreaming = setInterval(() => {
//                         const resultStreamingNode = node.querySelector('.result-streaming');
//                         if (resultStreamingNode) {
//                             clearInterval(checkForResultStreaming);
//                             console.log('result-streaming found');
//                             let fillerDiv = createUnderneathDiv(node);
//                             setTimeout(() => {
//                                 scrollToTop(node);
//                             }, 100);

//                             const removeFillerDivAfter1s = () => {
//                                 if (!node.querySelector('.result-streaming')) {
//                                   if (fillerDiv) {
//                                     fillerDiv.remove();
//                                     fillerDiv = null;
//                                     console.log('Filler div removed');
//                                   }
//                                   observer.disconnect();
//                                 }
//                               };
                              
//                               const observer = new MutationObserver(removeFillerDivAfter1s);
//                               observer.observe(node, { childList: true, subtree: true });
                              
//                         }
//                     }, 100);
//                 }
//             }
//         }
//     }
// };

// const observer = new MutationObserver(checkForNewDiv);
// observer.observe(document.body, { childList: true, subtree: true });
// console.log('Observer initiated');



// // const lastConversationTurnNode = document.querySelector('div[data-testid^="conversation-turn-"]:last-of-type');
