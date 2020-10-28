// mock functions for asyncStroage

getItem=(text)=>{return Promise.resolve(text)}
setItem=(text) => {return Promise.resolve(text)}

export default { getItem, setItem }