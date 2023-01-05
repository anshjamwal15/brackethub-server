let ts = Date.now();

const dateObject = new Date(ts);

const date = (`0 ${dateObject.getDate()}`).slice(-2);

const month = (`0 ${dateObject.getMonth() + 1}`).slice(-2);

const year = dateObject.getFullYear();

const hours = dateObject.getHours();

const minutes = dateObject.getMinutes();

const seconds = dateObject.getSeconds();

module.exports = {
    getCurrent() {
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    }
};